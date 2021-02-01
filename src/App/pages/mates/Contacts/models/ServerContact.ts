import { ContactId } from './Contact';

export interface ServerContact {
    manuallyAdded?: boolean;
    readonly _id: ContactId;
    name: string;
    number: string;
    email: string;
}
