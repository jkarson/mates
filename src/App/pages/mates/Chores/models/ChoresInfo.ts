import { UserId } from '../../../../common/models';
import { ChoreFrequency } from './ChoreFrequency';

export interface ChoresInfo {
    choreGenerators: ChoreGenerator[];
    chores: Chore[];
}

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

export type ChoreGeneratorID = string;

export interface Chore extends ChoreWithoutId {
    readonly _id: ChoreID;
}

export interface ChoreWithoutId {
    readonly choreGeneratorId: ChoreGeneratorID;
    name: string;
    assigneeIds: UserId[];
    date: Date;
    completed: boolean;
    completedBy?: UserId;
    showUntilCompleted: boolean;
}

export type ChoreID = string;
