import { UserId } from '../../../../common/models';

export interface MessageWithoutId {
    sender: string;
    senderId: UserId;
    time: Date;
    content: string;
}

export interface Message extends MessageWithoutId {
    readonly _id: MessageId;
}

export interface ServerMessage {
    _id: MessageId;
    sender: string;
    senderId: UserId;
    time: string;
    content: string;
}

export type MessageId = string;
