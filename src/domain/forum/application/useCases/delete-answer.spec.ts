import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to delete a question', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)
    
        await sut.execute({
            authorId: 'author-1',
            answerId: "answer-1"
        })
    
        expect(inMemoryAnswersRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
                authorId: 'author-2',
                answerId: 'answer-1'
            })
    
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
});

