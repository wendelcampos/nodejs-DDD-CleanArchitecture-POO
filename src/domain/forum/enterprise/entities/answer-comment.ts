import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { Comment, CommentProps } from "./comment"
export interface AnswerCommentProps extends CommentProps {
    answerId: UniqueEntityID
}
export class AnswerComment extends Comment<AnswerCommentProps> {
    get answerId() {
        return this.props.answerId
    }
    
    static create(props: Optional<AnswerCommentProps, 'createAt'>, id?: UniqueEntityID) {
        const answerComment = new AnswerComment(
            { 
            ...props, 
            createAt: props.createAt ?? new Date()
            }, 
            id
        )

        return answerComment
    }
}