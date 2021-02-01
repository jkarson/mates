import { UserId } from '../../../../common/models';
import { ChoreFrequency } from './ChoreFrequency';
import { ChoreGeneratorID, ChoreID } from './ChoresInfo';

export interface ServerChoresInfo {
    choreGenerators: ServerChoreGenerator[];
    chores: ServerChore[];
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
