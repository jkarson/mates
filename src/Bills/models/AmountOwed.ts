import { TenantId } from '../../Common/models';

export interface AmountOwed {
    tenantId: TenantId;
    initialAmount: number;
    currentAmount: number;
}
