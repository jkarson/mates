import { TenantId } from '../../../../common/models';

export interface AmountWithPercentOwed {
    tenantId: TenantId;
    amount: string;
    amountValue: number;
    percent: string;
    percentValue: number;
}
