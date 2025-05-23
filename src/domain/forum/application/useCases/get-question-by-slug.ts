import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { QuestionNotFoundError } from "../../../../core/errors/errors/question-not-found-error";

interface GetQuestionBySlugUseCaseRequest {
    slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<QuestionNotFoundError, { question: Question }>

export class GetQuestionBySlugUseCase {

        constructor( private questionRepository: QuestionsRepository) {}

        async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
           const question = await this.questionRepository.findBySlug(slug)

           if(!question) {
                return left(new QuestionNotFoundError())
           }

           return right({ question })
    }
}