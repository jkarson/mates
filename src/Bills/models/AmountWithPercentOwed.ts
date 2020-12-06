import { TenantId } from '../../Common/types';

export interface AmountWithPercentOwed {
    tenantId: TenantId;
    amount: string;
    amountValue: number;
    percent: string;
    percentValue: number;
}
