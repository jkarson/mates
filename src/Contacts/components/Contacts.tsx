import React, { useState, useContext } from 'react';
import { Contact, ContactWithoutId } from '../models/Contact';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartment, Tenant } from '../../Common/models';
import { assertUnreachable, getNewId } from '../../Common/utilities';
import Tabs from '../../Common/components/Tabs';
import { contactsTabNames, ContactsTabType } from '../models/ContactsTabs';
import ContactCell from './ContactCell';
import DescriptionCell from '../../Common/components/DescriptionCell';
import AddContactCell from './AddContactCell';

//EXTENSION: each Contact / tab could be color coded by type of contact

//EXTENSION: Manually added contacts can have manually added photos; other contacts have photos
//as defined in profile

const Contacts: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    const [tab, setTab] = useState<ContactsTabType>('All');

    const getTenantContacts = (apartment: Apartment): Contact[] => {
        const tenants = apartment.tenants;
        const apartmentContacts: Contact[] = [];
        tenants.forEach((tenant) => {
            apartmentContacts.push({
                name: tenant.name,
                email: tenant.email,
                number: tenant.number,
                manuallyAdded: false,
                id: tenant.id,
            });
        });
        return apartmentContacts.sort((a, b) =>
            a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1,
        );
    };

    const getFriendsContacts = (apartment: Apartment): Contact[] => {
        const friends = apartment.friendsInfo.friends;
        let friendsContacts: Contact[] = [];
        friends.forEach((apartment) => {
            friendsContacts = friendsContacts.concat(getTenantContacts(apartment));
        });
        return friendsContacts.sort((a, b) =>
            a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1,
        );
    };

    const getManuallyAddedContacts = (apartment: Apartment) =>
        apartment.manuallyAddedContacts.sort((a, b) =>
            a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1,
        );

    const getAllContacts = (apartment: Apartment) =>
        getTenantContacts(apartment)
            .concat(getFriendsContacts(apartment))
            .concat(getManuallyAddedContacts(apartment))
            .sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));

    let contacts: Contact[] = [];
    switch (tab) {
        case 'All':
            contacts = getAllContacts(user.apartment);
            break;
        case 'Friends':
            contacts = getFriendsContacts(user.apartment);
            break;
        case 'Manually Added':
            contacts = getManuallyAddedContacts(user.apartment);
            break;
        case 'Your Apartment':
            contacts = getTenantContacts(user.apartment);
            break;
        case 'Add New Contact':
            break;
        default:
            assertUnreachable(tab);
    }

    type TenantOrContact = Tenant | Contact;

    const handleNewContact = (c: ContactWithoutId) => {
        const manuallyAddedContacts: TenantOrContact[] = user.apartment.manuallyAddedContacts;
        const tenants: TenantOrContact[] = user.apartment.tenants;
        const friends = user.apartment.friendsInfo.friends;
        let friendTenants: TenantOrContact[] = [];
        friends.forEach((friend) => friendTenants.concat(friend.tenants));
        const IdPool: TenantOrContact[] = manuallyAddedContacts
            .concat(tenants)
            .concat(friendTenants);
        const newId = getNewId(IdPool);
        const newContact: Contact = { ...c, id: newId };

        user.apartment.manuallyAddedContacts.push(newContact);
        setUser({ ...user });
        setTab('Manually Added');
        //TO DO: Save to Database
    };

    const handleDeleteContact = (c: Contact) => {
        const manuallyAddedContacts = user.apartment.manuallyAddedContacts;
        const cIndex = manuallyAddedContacts.indexOf(c);
        manuallyAddedContacts.splice(cIndex, 1);
        setUser({ ...user });
        //TO DO: Save to Dtabase
    };

    return (
        <div>
            <Tabs<ContactsTabType> currentTab={tab} setTab={setTab} tabNames={contactsTabNames} />
            {tab === 'All' ? <ContactsDescriptionCell /> : null}
            {tab === 'Add New Contact' ? (
                <AddContactCell handleNewContact={handleNewContact} />
            ) : (
                <ContactsList handleDelete={handleDeleteContact} contacts={contacts} />
            )}
        </div>
    );
};

const ContactsDescriptionCell: React.FC = () => (
    <DescriptionCell content={'Only manually added contacts can be deleted.'} />
);

interface ContactsListProps {
    contacts: Contact[];
    handleDelete: (c: Contact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, handleDelete }) => (
    <div>
        {contacts.map((contact) => (
            <ContactCell key={contact.id} contact={contact} handleDelete={handleDelete} />
        ))}
    </div>
);

export default Contacts;
