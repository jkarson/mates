import { TenantId } from '../../Common/types';
import { BillGeneratorID } from './BillGenerator';

export interface Bill extends BillWithoutId {
    readonly id: BillId;
}

export interface BillWithoutId {
    readonly billGeneratorId: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenant?: TenantId;
    amountsOwed: AmountOwed[];
    date: Date;
    paid: boolean;
}

export interface AmountOwed {
    tenantId: TenantId;
    amount: number;
}

type BillId = string;
