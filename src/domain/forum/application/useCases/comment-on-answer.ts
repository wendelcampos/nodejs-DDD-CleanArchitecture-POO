import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { AnswersRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { QuestionNotFoundError } from "../../../../core/errors/errors/question-not-found-error";

interface CommentOnAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

type CommentOnAnswerUseCaseResponse = Either<QuestionNotFoundError, { answerComment: AnswerComment }>

export class CommentOnAnswerUseCase {

        constructor( 
            private answersRepository: AnswersRepository,
            private answerCommentRepository: AnswerCommentRepository
        ) {}

        async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
            const question = await this.answersRepository.findById(answerId)

            if (!question) {
                return left(new QuestionNotFoundError())
            }

            const answerComment = AnswerComment.create({
                authorId: new UniqueEntityID(authorId),
                answerId: new UniqueEntityID(answerId),
                content,
            })

            await this.answerCommentRepository.create(answerComment)

            return right({ answerComment })
    }
}