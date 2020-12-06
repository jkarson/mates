import { TenantId } from '../../Common/types';

export interface AmountOwed {
    tenantId: TenantId;
    initialAmount: number;
    currentAmount: number;
}
