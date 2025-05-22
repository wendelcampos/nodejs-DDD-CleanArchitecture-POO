import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { AnswerAttachmentList } from "./answer-attachment-list"
import { AggregateRoot } from "@/core/entities/aggregate-root"

export interface AnswerProps {
    content: string
    authorId: UniqueEntityID
    questionId: UniqueEntityID
    attachments: AnswerAttachmentList
    createAt: Date
    updateAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
    get authorId() {
        return this.props.authorId
    }

    get questionId() {
        return this.props.questionId
    }

    get content() {
        return this.props.content
    }

    get attachment() {
        return this.props.attachments
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

    set attachments(attachments: AnswerAttachmentList) {
        this.props.attachments = attachments
        this.touch()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    static create(props: Optional<AnswerProps, 'createAt' | 'attachments'>, id?: UniqueEntityID) {
        const answer = new Answer({ 
            ...props, 
            attachments: props.attachments ?? new AnswerAttachmentList(),
            createAt: props.createAt ?? new Date()
        }, id)

        return answer
    }
}