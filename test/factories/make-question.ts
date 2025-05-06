import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";

export function makeQuestion(override: Partial<QuestionProps> = {}) {
    const question =  Question.create({
        authorId: new UniqueEntityID('1'),
        title: 'Example Question',
        content: 'Example content',
        ...override
    })
    
    return question
}