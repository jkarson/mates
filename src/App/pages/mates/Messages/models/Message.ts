import { TenantId } from '../../../../common/models';

export interface MessageWithoutId {
    sender: string;
    senderId: TenantId;
    time: Date;
    content: string;
}

export interface Message extends MessageWithoutId {
    readonly id: MessageId;
}

export type MessageId = string;
