import { ServerApartmentEvent } from './ApartmentEvent';

export interface ServerEventsInfo {
    events: ServerApartmentEvent[];
    invitations: ServerApartmentEvent[];
}
