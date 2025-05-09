import { UseCaseError } from "@/core/errors/use-case-error";

export class QuestionCommentNotFoundError extends Error implements UseCaseError {
    constructor() {
        super('Question comment not found');
    }
}