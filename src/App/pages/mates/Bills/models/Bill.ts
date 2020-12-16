import { TenantId } from '../../../../common/models';
import { AmountOwed } from './AmountOwed';
import { BillGeneratorID } from './BillGenerator';

export interface Bill extends BillWithoutId {
    readonly id: BillId;
}

export interface BillWithoutId {
    readonly billGeneratorId: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenantId?: TenantId;
    amountsOwed: AmountOwed[];
    date: Date;
}

export type BillId = string;
