import { AnswersRepository } from "../repositories/answers-repository"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"
import { Either, left, right } from "@/core/either"
import { QuestionNotFoundError } from "./errors/question-not-found-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { AnswerNotFoundError } from "./errors/answer-not-found-error"

interface ChooseQuestionBestAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

type ChooseQuestionBestAnswerUseUseCaseResponse = Either<QuestionNotFoundError | ResourceNotFoundError | AnswerNotFoundError, { question: Question }>

export class ChooseQuestionBestAnswerUseCase {

    constructor( 
        private questionsRepository: QuestionsRepository,
        private answersRepository: AnswersRepository
    ) {}

    async execute({ authorId, answerId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new AnswerNotFoundError())
        }

        const question = await this.questionsRepository.findById(answer.questionId.toString())

        if (!question) {
            return left(new QuestionNotFoundError())
        }

        if (question.authorId.toString() !== authorId) {
            return left(new ResourceNotFoundError())
        }

       question.bestAnswerId = answer.id

       await this.questionsRepository.save(question)

       return right({ question })
    }
}