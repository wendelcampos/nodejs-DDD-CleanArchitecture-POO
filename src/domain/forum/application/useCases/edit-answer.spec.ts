import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)
    
        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: 'author-1',
            content: 'New content'
        })
    
        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'New content'
        })
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
                answerId: newAnswer.id.toString(),
                authorId: 'author-2',
                content: 'New content'
            })
    
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
});

