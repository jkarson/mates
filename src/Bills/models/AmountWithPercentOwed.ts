import { TenantId } from '../../Common/models';

export interface AmountWithPercentOwed {
    tenantId: TenantId;
    amount: string;
    amountValue: number;
    percent: string;
    percentValue: number;
}
