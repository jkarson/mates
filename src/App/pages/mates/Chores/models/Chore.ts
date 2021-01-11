import { UserId } from '../../../../common/models';
import { ChoreGeneratorID } from './ChoreGenerator';

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

export interface ServerChore {
    readonly _id: ChoreID;
    readonly choreGeneratorID: ChoreGeneratorID;
    name: string;
    assigneeIds: UserId[];
    date: string;
    completed: boolean;
    completedBy?: UserId;
    showUntilCompleted: boolean;
}

type ChoreID = string;
