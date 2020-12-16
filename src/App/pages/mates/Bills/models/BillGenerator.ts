import { TenantId } from '../../../../common/models';
import { AmountWithPercentOwed } from './AmountWithPercentOwed';
import { BillFrequency } from './BillFrequency';

export interface BillGenerator {
    readonly id: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenantId?: TenantId;
    frequency: BillFrequency;
    amountsWithPercentOwed: AmountWithPercentOwed[];
    starting: Date;
    updatedThrough: Date;
}

export type BillGeneratorID = string;
