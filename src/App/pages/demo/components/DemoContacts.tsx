import React, { useState, useContext, useEffect } from 'react';
import DescriptionCell from '../../../common/components/DescriptionCell';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Apartment } from '../../../common/models';
import { assertUnreachable } from '../../../common/utilities';
import AddContactCell from '../../mates/Contacts/components/AddContactCell';
import ContactCell from '../../mates/Contacts/components/ContactCell';
import { Contact, ContactWithoutId } from '../../mates/Contacts/models/Contact';
import { ContactsTabType, contactsTabNames } from '../../mates/Contacts/models/ContactsTabs';
import { FriendProfile } from '../../mates/Friends/models/FriendsInfo';
import { getNewId } from '../utilities';

const DemoContacts: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [tab, setTab] = useState<ContactsTabType>('All');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [tab]);

    const getTenantContacts = (apartment: Apartment | FriendProfile): Contact[] => {
        const tenants = apartment.tenants;
        const apartmentContacts: Contact[] = [];
        tenants.forEach((tenant) => {
            apartmentContacts.push({
                name: tenant.name,
                email: tenant.email,
                number: tenant.number,
                manuallyAdded: false,
                _id: tenant.userId,
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

    const handleNewContact = (c: ContactWithoutId) => {
        const idPool = getAllContacts(user.apartment);
        const newId = getNewId(idPool, '_id');
        const newContact = { ...c, _id: newId };
        user.apartment.manuallyAddedContacts.push(newContact);
        setUser({ ...user });
        setTab('Manually Added');
    };

    const handleDeleteContact = (c: Contact) => {
        const contactIndex = user.apartment.manuallyAddedContacts.findIndex(
            (contact) => contact._id === c._id,
        );
        if (contactIndex !== -1) {
            user.apartment.manuallyAddedContacts.splice(contactIndex, 1);
            setUser({ ...user });
            setMessage('Contact deleted');
        }
    };

    return (
        <div>
            <Tabs<ContactsTabType> currentTab={tab} setTab={setTab} tabNames={contactsTabNames} />
            {message.length === 0 ? null : <p style={{ color: 'red' }}>{message}</p>}
            <ContactsDescriptionCell tab={tab} />
            {tab === 'Add New Contact' ? (
                <AddContactCell
                    handleNewContact={handleNewContact}
                    newContactError={''}
                    setNewContactError={() => null}
                />
            ) : (
                <ContactsList handleDelete={handleDeleteContact} contacts={contacts} />
            )}
        </div>
    );
};

interface ContactsDescriptionCellProps {
    tab: ContactsTabType;
}

const ContactsDescriptionCell: React.FC<ContactsDescriptionCellProps> = ({ tab }) => {
    let content: string;
    switch (tab) {
        case 'All':
            content = 'A list of all your contacts. Only manually added contacts can be deleted.';
            break;
        case 'Your Apartment':
            content = 'The contact information of the tenants in your apartment';
            break;
        case 'Friends':
            content = "The contact information of your apartment's friends";
            break;
        case 'Manually Added':
            content = 'Contacts that were manually added by tenants of your apartment.';
            break;
        case 'Add New Contact':
            content = 'Manually add a contact.';
            break;
    }
    return <DescriptionCell content={content} />;
};

interface ContactsListProps {
    contacts: Contact[];
    handleDelete: (c: Contact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, handleDelete }) => (
    <div>
        {contacts.map((contact) => (
            <ContactCell key={contact._id} contact={contact} handleDelete={handleDelete} />
        ))}
    </div>
);

export default DemoContacts;
