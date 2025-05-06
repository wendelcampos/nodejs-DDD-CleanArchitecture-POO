import { AnswersRepository } from "../repositories/answers-repository"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"

interface ChooseQuestionBestAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

interface ChooseQuestionBestAnswerUseUseCaseResponse {
    question: Question
}

export class ChooseQuestionBestAnswerUseCase {

    constructor( 
        private questionsRepository: QuestionsRepository,
        private answersRepository: AnswersRepository
    ) {}

    async execute({ authorId, answerId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            throw new Error('Answer not found')
        }

        const question = await this.questionsRepository.findById(answer.questionId.toString())

        if (!question) {
            throw new Error('Question not found')
        }

        if (question.authorId.toString() !== authorId) {
            throw new Error('Nor allowed')
        }

       question.bestAnswerId = answer.id

       await this.questionsRepository.save(question)

       return {
            question
       }
    }
}