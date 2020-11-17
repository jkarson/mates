import { TenantId } from '../../Common/types';

export interface ChoreGenerator {
    readonly id: ChoreGeneratorID;
    name: string;
    assigneeIds: TenantId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
    updatedThrough: Date;
}

export const choreFrequencies = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
    'Yearly',
    'Once',
] as const;
export type ChoreFrequency = typeof choreFrequencies[number];

export type ChoreGeneratorID = string;
