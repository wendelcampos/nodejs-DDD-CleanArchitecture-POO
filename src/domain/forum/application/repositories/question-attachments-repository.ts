import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

export interface QuestionAttachmentsRepository {
    findManyQuestionId(questionId: string): Promise<QuestionAttachment[]>
    deleteManyByQuestionId(questionId: string): Promise<void>
}