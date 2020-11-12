import { months, weekdays } from "./constants";

export interface StateProps<T> {
    state: T;
    setState: React.Dispatch<React.SetStateAction<T>> | ((T: T) => void);
}

export interface ObjectWithId {
    id: string;
}

export type ApartmentId = string;
export type TenantId = string;

export type Month = typeof months[number];
//export type Weekday = typeof weekdays[number]; do i still need this anywhere?
export type AMPM = 'AM' | 'PM';
