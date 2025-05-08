import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface CommentProps {
    authorId: UniqueEntityID
    content: string
    createAt: Date
    updateAt?: Date
}

export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
    get authorId() {
        return this.props.authorId
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

    private touch() {
        this.props.updateAt = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }
}