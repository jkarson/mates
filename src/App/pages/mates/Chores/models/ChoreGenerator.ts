import { UserId } from '../../../../common/models';
import { ChoreFrequency } from './ChoreFrequency';

export interface ChoreGenerator extends ChoreGeneratorWithoutId {
    readonly _id: ChoreGeneratorID;
}

export interface ChoreGeneratorWithoutId {
    name: string;
    assigneeIds: UserId[];
    frequency: ChoreFrequency;
    starting: Date;
    updatedThrough: Date;
    showUntilCompleted: boolean;
}

export interface ServerChoreGenerator {
    readonly _id: ChoreGeneratorID;
    name: string;
    assigneeIds: UserId[];
    frequency: ChoreFrequency;
    starting: string;
    updatedThrough: string;
    showUntilCompleted: boolean;
}

export type ChoreGeneratorID = string;
