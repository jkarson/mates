import { UserId } from '../../../../common/models';
import { AmountOwed } from './AmountOwed';
import { AmountWithPercentOwed } from './AmountWithPercentOwed';
import { BillFrequency } from './BillFrequency';
import { BillId, BillGeneratorID } from './BillsInfo';

export interface ServerBillsInfo {
    bills: ServerBill[];
    billGenerators: ServerBillGenerator[];
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
