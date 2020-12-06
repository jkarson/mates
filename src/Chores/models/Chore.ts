import { TenantId } from '../../Common/types';
import { ChoreGeneratorID } from './ChoreGenerator';

export interface Chore extends ChoreWithoutId {
    readonly id: ChoreID;
}

export interface ChoreWithoutId {
    readonly choreGeneratorID: ChoreGeneratorID;
    name: string;
    assigneeIds: TenantId[];
    date: Date;
    completed: boolean;
    completedBy?: TenantId;
    showUntilCompleted: boolean;
}

type ChoreID = string;
