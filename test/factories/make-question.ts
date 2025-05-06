import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";

export function makeQuestion(override: Partial<QuestionProps> = {}, id? : UniqueEntityID) {
    const question =  Question.create({
        authorId: new UniqueEntityID('1'),
        title: faker.lorem.sentence(10),
        content: faker.lorem.text(),
        ...override
    }, id)
    
    return question
}