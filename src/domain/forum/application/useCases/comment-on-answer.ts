import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { AnswersRepository } from "../repositories/answers-repository";

interface CommentOnAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

interface CommentOnAnswerUseCaseResponse {
    answerComment: AnswerComment;
}

export class CommentOnAnswerUseCase {

        constructor( 
            private answersRepository: AnswersRepository,
            private answerCommentRepository: AnswerCommentRepository
        ) {}

        async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
            const question = await this.answersRepository.findById(answerId)

            if (!question) {
                throw new Error('Question not found')
            }

            const answerComment = AnswerComment.create({
                authorId: new UniqueEntityID(authorId),
                answerId: new UniqueEntityID(answerId),
                content,
            })

            await this.answerCommentRepository.create(answerComment)

            return {
                answerComment,
            }
    }
}