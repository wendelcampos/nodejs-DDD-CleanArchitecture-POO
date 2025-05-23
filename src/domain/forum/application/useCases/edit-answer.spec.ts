import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let InMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        InMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(InMemoryAnswerAttachmentsRepository)

        sut = new EditAnswerUseCase(inMemoryAnswersRepository, InMemoryAnswerAttachmentsRepository)
    })

    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        InMemoryAnswerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: 'author-1',
            content: 'New content',
            attachmentsIds: ['1', '3']
        })
    
        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'New content'
        })
        // expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        // expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
        //     expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        //     expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        // ])
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
                answerId: newAnswer.id.toString(),
                authorId: 'author-2',
                content: 'New content',
                attachmentsIds: []
            })
    
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
});

