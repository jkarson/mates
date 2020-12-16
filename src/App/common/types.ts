import { BillFrequency } from '../pages/mates/Bills/models/BillFrequency';
import { ChoreFrequency } from '../pages/mates/Chores/models/ChoreFrequency';
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
