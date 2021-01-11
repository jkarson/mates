import { UserId } from '../../../../common/models';
import { AmountWithPercentOwed } from './AmountWithPercentOwed';
import { BillFrequency } from './BillFrequency';

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

export interface ServerBillGenerator {
    readonly _id: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenantId?: UserId;
    frequency: BillFrequency;
    amountsWithPercentOwed: AmountWithPercentOwed[];
    starting: string;
    updatedThrough: string;
}

export type BillGeneratorID = string;
