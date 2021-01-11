import { ServerChore } from './Chore';
import { ServerChoreGenerator } from './ChoreGenerator';

export interface ServerChoresInfo {
    choreGenerators: ServerChoreGenerator[];
    chores: ServerChore[];
}
