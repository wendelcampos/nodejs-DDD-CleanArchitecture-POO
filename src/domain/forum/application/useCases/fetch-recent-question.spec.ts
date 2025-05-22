import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to fetch recent questions', async () => {
        await inMemoryQuestionsRepository.create(makeQuestion({ createAt: new Date('2022, 0, 20') }))
        await inMemoryQuestionsRepository.create(makeQuestion({ createAt: new Date('2022, 0, 18') }))
        await inMemoryQuestionsRepository.create(makeQuestion({ createAt: new Date('2022, 0, 23') }))

        const result = await sut.execute({
            page: 1,
        })

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createAt: new Date('2022, 0, 23') }),
            expect.objectContaining({ createAt: new Date('2022, 0, 20') }),
            expect.objectContaining({ createAt: new Date('2022, 0, 18') }),
        ])
    });
    
    it('should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsRepository.create(makeQuestion())
        }

        const result = await sut.execute({
            page: 2,
        })

       expect(result.value?.questions).toHaveLength(2)
    });

})