import { convertHoursToMS } from '../Common/utilities';
import { ApartmentEvent } from './models/ApartmentEvent';

export function isPastEvent(event: ApartmentEvent) {
    return event.time.getTime() < Date.now() - convertHoursToMS(24);
}

export function isPresentEvent(event: ApartmentEvent) {
    return (
        Date.now() - convertHoursToMS(24) <= event.time.getTime() &&
        event.time.getTime() <= Date.now() + convertHoursToMS(24)
    );
}

export function isFutureEvent(event: ApartmentEvent) {
    return event.time.getTime() > Date.now() + convertHoursToMS(24);
}
