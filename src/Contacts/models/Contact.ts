export interface Contact extends ContactWithoutId {
    readonly id: ContactId;
}

export interface ContactWithoutId {
    name: string;
    manuallyAdded: boolean;
    number?: string;
    email?: string;
}

export type ContactId = string;
