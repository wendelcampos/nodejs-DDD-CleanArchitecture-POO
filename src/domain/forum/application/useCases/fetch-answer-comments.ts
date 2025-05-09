import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { answerComments: AnswerComment[] }>

export class FetchAnswerCommentsUseCase {

        constructor( private answerCommentRepository: AnswerCommentRepository) {}

        async execute({ page, answerId }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
           const answerComments = await this.answerCommentRepository.findManyAnswerId(answerId, { page })

           return right({ answerComments })
    }
}