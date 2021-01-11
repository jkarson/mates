export interface Contact extends ContactWithoutId {
    readonly _id: ContactId;
}

export interface ContactWithoutId {
    name: string;
    manuallyAdded: boolean;
    number?: string;
    email?: string;
}

export type ContactId = string;
