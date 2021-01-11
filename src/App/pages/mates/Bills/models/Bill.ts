import { UserId } from '../../../../common/models';
import { AmountOwed } from './AmountOwed';
import { BillGeneratorID } from './BillGenerator';

export interface Bill extends BillWithoutId {
    readonly _id: BillId;
}

export interface BillWithoutId {
    readonly billGeneratorId: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenantId?: UserId;
    amountsOwed: AmountOwed[];
    date: Date;
}

export interface ServerBill {
    readonly _id: BillId;
    readonly billGeneratorId: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenantId?: UserId;
    amountsOwed: AmountOwed[];
    date: string;
}

export type BillId = string;
