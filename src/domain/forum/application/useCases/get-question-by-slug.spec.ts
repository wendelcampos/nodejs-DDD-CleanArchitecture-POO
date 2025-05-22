import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create('example-question')
        })
        await inMemoryQuestionsRepository.create(newQuestion)
    
        const result: any = await sut.execute({
            slug: 'example-question'
        })
    
        expect(result.value?.question.id).toBeTruthy()
        expect(result.value?.question.title).toEqual(newQuestion.title)
    })
});

