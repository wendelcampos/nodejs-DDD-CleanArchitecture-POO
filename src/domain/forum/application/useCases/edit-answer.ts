import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerNotFoundError } from "../../../../core/errors/errors/answer-not-found-error";

interface EditAnswerUseCaseRequest {
    authorId: string;
    answerId: string; 
    content: string;
    attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<AnswerNotFoundError | NotAllowedError, { answer: Answer }>

export class EditAnswerUseCase {

    constructor( 
        private answerRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async execute({ authorId, answerId, content, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new AnswerNotFoundError())
        }

        if(authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyAnswerId(answerId)
        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)
    
        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id
            })
        })
    
        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList
        answer.content = content

        await this.answerRepository.save(answer)

        return right({ answer })
    }
}