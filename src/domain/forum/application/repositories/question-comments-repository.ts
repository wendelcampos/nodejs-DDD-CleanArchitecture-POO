import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionsCommentRepository {
    findById(id: string): Promise<QuestionComment | null>
    findManyQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>
    create(questionComment: QuestionComment): Promise<void>
    delete(questionComment: QuestionComment): Promise<void>
}