import { Bill, ServerBill } from '../pages/mates/Bills/models/Bill';
import { BillFrequency } from '../pages/mates/Bills/models/BillFrequency';
import { BillGenerator, ServerBillGenerator } from '../pages/mates/Bills/models/BillGenerator';
import { Chore, ServerChore } from '../pages/mates/Chores/models/Chore';
import { ChoreFrequency } from '../pages/mates/Chores/models/ChoreFrequency';
import {
    ChoreGenerator,
    ChoreGeneratorID,
    ServerChoreGenerator,
} from '../pages/mates/Chores/models/ChoreGenerator';
import { ApartmentEvent, ServerApartmentEvent } from '../pages/mates/Events/models/ApartmentEvent';
import { Message, ServerMessage } from '../pages/mates/Messages/models/Message';
import { months, weekdays } from './constants';

export interface StateProps<T> {
    state: T;
    setState: React.Dispatch<React.SetStateAction<T>> | ((T: T) => void);
}

//TO DO: pending server interaction, we can
//type-guard this more strictly.
export interface ObjectWithId {
    id: string;
}

export type Frequency = BillFrequency | ChoreFrequency;

export type Month = typeof months[number];
export type Weekday = typeof weekdays[number];

export type AMPM = 'AM' | 'PM';

export interface DateTimeInputType {
    date: Date;
    time: TimeInputType;
}

export interface TimeInputType {
    hour: number;
    minute: number;
    ampm: AMPM;
}

//server class can probably just be a general thing that we case all server objects
//to... keeping track of what obj it is is / other info is so far not useful

//note: my type system can and should be dramatically simplified after MVP
export type ServerClass =
    | ServerMessage
    | ServerBillGenerator
    | ServerBill
    | ServerChore
    | ServerChoreGenerator
    | ServerApartmentEvent; //| Server_x | Server_y ...
export type ClientClass = Message | BillGenerator | Bill | Chore | ChoreGenerator | ApartmentEvent; // | and...
