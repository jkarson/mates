import { UserId } from '../../../../common/models';

export interface AmountWithPercentOwed {
    userId: UserId;
    amount: string;
    amountValue: number;
    percent: string;
    percentValue: number;
}
