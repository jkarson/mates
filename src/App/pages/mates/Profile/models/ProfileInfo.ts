import { UserId } from '../../../../common/models';

export interface ProfileInfo {
    code: string;
    name: string;
    quote?: string;
    address?: string;
    requests: JoinRequest[];
}

export interface JoinRequest {
    _id: UserId;
    username: string;
}
