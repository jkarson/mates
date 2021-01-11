import React, { useState, useContext, useEffect } from 'react';
import { Contact, ContactWithoutId } from '../models/Contact';
import { contactsTabNames, ContactsTabType } from '../models/ContactsTabs';
import ContactCell from './ContactCell';
import AddContactCell from './AddContactCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { Apartment, FriendProfile, Tenant } from '../../../../common/models';
import { assertUnreachable, getDeleteOptions, getPostOptions } from '../../../../common/utilities';
import { Redirect } from 'react-router-dom';
import { initializeServerContacts } from '../utilities';

//EXTENSION: each Contact / tab could be color coded by type of contact

//EXTENSION: Manually added contacts can have manually added photos; other contacts have photos
//as defined in profile

const Contacts: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [tab, setTab] = useState<ContactsTabType>('All');
    const [redirect, setRedirect] = useState(false);
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
        const data = {
            apartmentId: user.apartment._id,
            contact: c,
        };
        const options = getPostOptions(data);
        fetch('/mates/addNewContact', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the contact could not be saved');
                    return;
                }
                const { manuallyAddedContacts } = json;
                const markedContacts = initializeServerContacts(manuallyAddedContacts);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, manuallyAddedContacts: markedContacts },
                });
                setTab('Manually Added');
            });
    };

    const handleDeleteContact = (c: Contact) => {
        const data = { apartmentId: user.apartment._id, contactId: c._id };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteContact', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the contact could not be deleted');
                    return;
                }
                const { remainingManuallyAddedContacts } = json;
                const markedContacts = initializeServerContacts(remainingManuallyAddedContacts);
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        manuallyAddedContacts: markedContacts,
                    },
                });
                setMessage('Contact deleted');
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <Tabs<ContactsTabType> currentTab={tab} setTab={setTab} tabNames={contactsTabNames} />
            {message.length === 0 ? null : <p style={{ color: 'red' }}>{message}</p>}
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
            <ContactCell key={contact._id} contact={contact} handleDelete={handleDelete} />
        ))}
    </div>
);

export default Contacts;
