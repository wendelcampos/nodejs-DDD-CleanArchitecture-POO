import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface AnswerProps {
    content: string
    authorId: UniqueEntityID
    questionId: UniqueEntityID
    createAt: Date
    updateAt?: Date
}

export class Answer extends Entity<AnswerProps> {
    get authorId() {
        return this.props.authorId
    }

    get questionId() {
        return this.props.questionId
    }

    get content() {
        return this.props.content
    }

    get createAt() {
        return this.props.createAt
    }

    get updateAt() {
        return this.props.updateAt
    }

    get excerpt() {
        return this.content
            .substring(0, 120)
            .trimEnd()
            .concat('...')
    }

    private touch() {
        this.props.updateAt = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    static create(props: Optional<AnswerProps, 'createAt'>, id?: UniqueEntityID) {
        const answer = new Answer({ 
            ...props, 
            createAt: props.createAt ?? new Date()
        }, id)

        return answer
    }
}