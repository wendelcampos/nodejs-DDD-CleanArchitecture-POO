import { AnswersRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { AnswerNotFoundError } from "../../../../core/errors/errors/answer-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";

interface DeleteAnswerUseCaseRequest {
    authorId: string;
    answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<AnswerNotFoundError | NotAllowedError, {}>

export class DeleteAnswerUseCase {

    constructor( private answersRepository: AnswersRepository) {}

    async execute({ authorId, answerId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new AnswerNotFoundError())

        }

        if(authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        await this.answersRepository.delete(answer)

        return right({})
    }
}