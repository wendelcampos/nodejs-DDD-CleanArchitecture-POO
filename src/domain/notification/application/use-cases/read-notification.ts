import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notification-repository";
import { AnswerNotFoundError } from "@/core/errors/errors/answer-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface ReadNotificationUseCaseRequest {
    recipientId: string;
    notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<AnswerNotFoundError | NotAllowedError, { notification: Notification }>

export class ReadNotificationUseCase {

        constructor( private notificationsRepository: NotificationsRepository) {}

        async execute({ recipientId, notificationId }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
            const notification = await this.notificationsRepository.findById(notificationId)

            if (!notification) {
                return left(new AnswerNotFoundError())
            }
           
            if(recipientId !== notification.recipientId.toString()) {
                return left(new NotAllowedError())
            }

            notification.read()
           
           await this.notificationsRepository.save(notification)

           return right({ notification })
    }
}