import { TenantId } from '../../../../common/models';

export interface AmountOwed {
    tenantId: TenantId;
    initialAmount: number;
    currentAmount: number;
}
