import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Answers', () => {
    beforeEach(() => {
        inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository)
    })

    it('should be able to fetch question answers', async () => {
        await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('question-1') }))
        await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('question-1') }))
        await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityID('question-1') }))

        const result = await sut.execute({
            answerId: 'question-1',
            page: 1,
        })

        expect(result.value?.answerComments).toHaveLength(3)
    });
    
    it('should be able to fetch paginated question answers', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswersCommentsRepository.create(makeAnswerComment({
                answerId: new UniqueEntityID('question-1'),
            }))
        }

        const result = await sut.execute({
            answerId: 'question-1',
            page: 2,
        })

       expect(result.value?.answerComments).toHaveLength(2)
    });

})