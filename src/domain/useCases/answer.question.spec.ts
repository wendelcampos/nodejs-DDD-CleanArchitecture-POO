import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'

const fakeAnswerRepository: AnswersRepository = {
    create: async (answer: Answer)  => {
        return
    }
}
test('create an answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository)

    const answer = await answerQuestion.execute({
        questionId: '1',
        instructorId: '1',
        content: 'Nova Resposta'
    })

    expect(answer.content).toEqual('Nova Resposta')
})