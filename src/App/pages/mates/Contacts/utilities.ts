import { isLetter } from '../../../common/utilities';
import { Contact } from './models/Contact';

export const getInitials = (name: string) => {
    let initials: string = '';
    const names = name.split(' ');
    const firstLetters = names.map((name) => name.charAt(0));

    //limit to 3 initials
    const firstThreeLetters = firstLetters.length <= 3 ? firstLetters : firstLetters.slice(0, 3);

    firstThreeLetters.forEach((firstLetter) => {
        if (isLetter(firstLetter)) {
            initials += firstLetter.toUpperCase();
        }
    });
    return initials;
};

export const initializeServerContacts = (manuallyAddedContacts: Contact[]) => {
    return markManuallyAddedContacts(manuallyAddedContacts);
};

const markManuallyAddedContacts = (contacts: Contact[]): Contact[] => {
    contacts.map((contact) => (contact.manuallyAdded = true));
    return contacts;
};
