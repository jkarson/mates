import { TenantId } from '../../Common/types';

export interface ChoreGenerator {
    readonly id: ChoreGeneratorID;
    name: string;
    assigneeIds: TenantId[];
    frequency: Frequency;
    starting: Date;
    showUntilCompleted: boolean;
    updatedThrough: Date;
}

export const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Once'] as const;
export type Frequency = typeof frequencies[number];

export type ChoreGeneratorID = string;
