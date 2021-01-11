import { UserId } from '../../../../common/models';

export interface AmountOwed {
    userId: UserId;
    initialAmount: number;
    currentAmount: number;
}
