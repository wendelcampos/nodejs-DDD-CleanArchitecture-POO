import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionsCommentRepository } from "../repositories/question-comments-repository";
import { QuestionNotFoundError } from "../../../../core/errors/errors/question-not-found-error";
import { Either, left, right } from "@/core/either";

interface CommentOnQuestionUseCaseRequest {
    authorId: string;
    questionId: string;
    content: string;
}

type CommentOnQuestionUseCaseResponse = Either<QuestionNotFoundError, { questionComment: QuestionComment }>

export class CommentOnQuestionUseCase {

        constructor( 
            private questionRepository: QuestionsRepository,
            private questionCommentRepository: QuestionsCommentRepository
        ) {}

        async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
            const question = await this.questionRepository.findById(questionId)

            if (!question) {
                return left(new QuestionNotFoundError())

            }

            const questionComment = QuestionComment.create({
                authorId: new UniqueEntityID(authorId),
                questionId: new UniqueEntityID(questionId),
                content,
            })

            await this.questionCommentRepository.create(questionComment)

            return right({ questionComment })
    }
}