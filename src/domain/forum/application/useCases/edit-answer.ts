import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { QuestionNotFoundError } from "./errors/question-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface EditAnswerUseCaseRequest {
    authorId: string;
    answerId: string; 
    content: string;
}

type EditAnswerUseCaseResponse = Either<QuestionNotFoundError | NotAllowedError, { answer: Answer }>

export class EditAnswerUseCase {

    constructor( private answerRepository: AnswersRepository) {}

    async execute({ authorId, answerId, content }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new QuestionNotFoundError())
        }

        if(authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        answer.content = content

        await this.answerRepository.save(answer)

        return right({ answer })
    }
}