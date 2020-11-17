import { TenantId } from '../../Common/types';
import { AmountOwed } from './Bill';

export interface BillGenerator {
    readonly id: BillGeneratorID;
    name: string;
    payableTo: string;
    isPrivate: boolean;
    privateTenant?: TenantId;
    frequency: BillFrequency;
    amountsOwed: AmountOwed[];
    starting: Date;
    updatedThrough: Date;
}

export const billFrequencies = [
    'Weekly',
    'Monthly',
    'Every 2 Months',
    'Every 3 Months',
    'Every 4 Months',
    'Every 6 Months',
    'Yearly',
    'Once',
] as const;
export type BillFrequency = typeof billFrequencies[number];

export type BillGeneratorID = string;
