import { TenantId } from '../../Common/types';
import { ChoreFrequency } from './ChoreFrequency';

export interface ChoreGenerator {
    readonly id: ChoreGeneratorID;
    name: string;
    assigneeIds: TenantId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
    updatedThrough: Date;
}

export type ChoreGeneratorID = string;
