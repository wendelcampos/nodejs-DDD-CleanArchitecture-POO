import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswerComment()

        await inMemoryAnswerCommentsRepository.create(answerComment)
    
        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })
    
        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user answer comment', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityID('author-1'),
        })

        await inMemoryAnswerCommentsRepository.create(answerComment)
    
        await expect(() => {
            return sut.execute({
                answerCommentId: answerComment.id.toString(),
                authorId: 'author-2',
            })
        }).rejects.toBeInstanceOf(Error)
    })
});

