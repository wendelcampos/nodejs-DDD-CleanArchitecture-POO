import { Either, left, right } from "@/core/either";
import { QuestionsCommentRepository } from "../repositories/question-comments-repository";
import { QuestionCommentNotFoundError } from "./errors/question-comment-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface DeleteQuestionCommentUseCaseRequest {
    authorId: string;
    questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<QuestionCommentNotFoundError | NotAllowedError, {}>

export class DeleteQuestionCommentUseCase {

        constructor( 
            private questionCommentRepository: QuestionsCommentRepository,
        ) {}

        async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
            const questionComment = await this.questionCommentRepository.findById(questionCommentId)

            if (!questionComment) {
                return left(new QuestionCommentNotFoundError())
            }

            if (questionComment.authorId.toString() !== authorId) {
                return left(new NotAllowedError())
            }

            await this.questionCommentRepository.delete(questionComment)

            return right({})
    }
}