import { UserId } from '../../../../common/models';
import { AmountOwed } from './AmountOwed';
import { AmountWithPercentOwed } from './AmountWithPercentOwed';
import { BillFrequency } from './BillFrequency';

export interface BillsInfo {
    billGenerators: BillGenerator[];
    bills: Bill[];
}

export interface BillGenerator extends BillGeneratorWithoutId {
    readonly _id: BillGeneratorID;
}

export interface BillGeneratorWithoutId {
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenantId?: UserId;
    frequency: BillFrequency;
    amountsWithPercentOwed: AmountWithPercentOwed[];
    starting: Date;
    updatedThrough: Date;
}

export type BillGeneratorID = string;

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

export type BillId = string;
