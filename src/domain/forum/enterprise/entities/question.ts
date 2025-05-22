import { AggregateRoot } from "@/core/entities/aggregate-root"
import { Slug } from "./value-objects/slug"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { QuestionAttachmentList } from "./question-attachment-list"

import dayjs from 'dayjs'
export interface QuestionProps {
    authorId: UniqueEntityID
    bestAnswerId?: UniqueEntityID
    title: string
    content: string
    slug: Slug
    attachments: QuestionAttachmentList
    createAt: Date
    updateAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
    get authorId() {
        return this.props.authorId
    }

    get bestAnswerId() {
        return this.props.bestAnswerId
    }

    get title() {
        return this.props.title
    }

    get content() {
        return this.props.content
    }

    get slug() {
        return this.props.slug
    }

    get attachments() {
        return this.props.attachments
    }

    get createAt() {
        return this.props.createAt
    }

    get updateAt() {
        return this.props.updateAt
    }

    get isNew(): boolean {
        return dayjs().diff(this.createAt, 'days') <= 3
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

    set title(title: string) {
        this.props.title = title
        this.props.slug = Slug.createFromText(title)

        this.touch()
    }

    set content(content: string) {
        this.props.content = content

        this.touch()
    }

    set attachments(attachments: QuestionAttachmentList) {
        this.props.attachments = attachments
    }


    set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
        this.props.bestAnswerId = bestAnswerId
        
        this.touch()
    }

    static create(props: Optional<QuestionProps, 'createAt' | 'slug' | 'attachments'>, id?: UniqueEntityID) {
        const question = new Question({ 
            ...props, 
            slug: props.slug ?? Slug.createFromText(props.title),
            attachments: props.attachments ?? new QuestionAttachmentList(),
            createAt: props.createAt ?? new Date()
        }, id)

        return question
    }
}