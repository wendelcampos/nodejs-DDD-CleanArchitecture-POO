import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { DomainEvents } from "@/events/domain-events";
export class InMemoryQuestionsRepository implements QuestionsRepository {
    public items: Question[] = [];

    constructor(
        private questionAttachmentRepository: QuestionAttachmentsRepository,
    ){}

    async findById(id: string) {
        const question = this.items.find((item) => item.id.toString() === id);

        if (!question) {
            return null
        }

        return question;
    }

    async findBySlug(slug: string) {
        const question = this.items.find((item) => item.slug.value === slug);

        if (!question) {
            return null
        }

        return question;
    }

    async findByManyRecent({ page }: PaginationParams) {
        const questions = this.items
            .sort((a, b) => b.createAt.getTime() - a.createAt.getTime())
            .slice((page - 1) * 20, page * 20);

        return questions;
    }

    async create(question: Question) {
        this.items.push(question);

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async save(question: Question){
        const itemIndex = this.items.findIndex((item) => item.id === question.id);

        this.items[itemIndex] = question;

        DomainEvents.dispatchEventsForAggregate(question.id)

    }

   async delete(question: Question){
        const itemIndex = this.items.findIndex((item) => item.id === question.id);

        this.items.splice(itemIndex, 1);

        this.questionAttachmentRepository.deleteManyByQuestionId(question.id.toString())
    }
}