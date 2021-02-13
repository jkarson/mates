import React, { useState, useContext, useEffect } from 'react';
import { Contact, ContactWithoutId } from '../models/Contact';
import { contactsTabNames, ContactsTabType } from '../models/ContactsTabs';
import ContactCell from './ContactCell';
import AddContactCell from './AddContactCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { Apartment } from '../../../../common/models';
import { assertUnreachable, getDeleteOptions, getPostOptions } from '../../../../common/utilities';
import { Redirect } from 'react-router-dom';
import { initializeServerContacts } from '../utilities';
import { FriendProfile } from '../../Friends/models/FriendsInfo';
import RedMessageCell from '../../../../common/components/RedMessageCell';

//PICK UP / TO DO:
/*
    -make sure phone number input formatting / restricting is taken care of
    -add the house icon to the top left and have this be accessible as a refresh in Mates and a mates link in the profile link screen
    -modularize components or come up w a better system for similar common buttons... separating out
     the css shows how useful it is though
     -Friends, Events, Chores, Bills, Profile
     -Demo needs to be in sync too!
*/

//EXTENSION: Edit contacts

//EXTENSION: each Contact / tab could be color coded by type of contact

//EXTENSION: Manually added contacts can have manually added photos; other contacts have photos
//as defined in profile

import '../styles/Contacts.css';

const Contacts: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [tab, setTab] = useState<ContactsTabType>('All');
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    const [newContactError, setNewContactError] = useState('');

    useEffect(() => {
        setMessage('');
    }, [tab]);

    function isFriend(apartment: Apartment | FriendProfile): apartment is FriendProfile {
        return (apartment as FriendProfile).apartmentId !== undefined;
    }

    const getTenantContacts = (apartment: Apartment | FriendProfile): Contact[] => {
        const tenants = apartment.tenants;
        const apartmentContacts: Contact[] = [];

        tenants.forEach((tenant) => {
            apartmentContacts.push({
                name: tenant.name,
                email: tenant.email,
                number: tenant.number,
                manuallyAdded: false,
                _id: tenant.userId + (isFriend(apartment) ? apartment.apartmentId : apartment._id),
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
        // const data = {
        //     apartmentId: user.apartment._id,
        //     contact: c,
        // };
        // const options = getPostOptions(data);
        // fetch('/mates/addNewContact', options)
        //     .then((response) => response.json())
        //     .then((json) => {
        //         const { authenticated, success } = json;
        //         if (!authenticated) {
        //             setRedirect(true);
        //             return;
        //         }
        //         if (!success) {
        //             setNewContactError('Sorry, the contact could not be saved');
        //             return;
        //         }
        //         const { manuallyAddedContacts } = json;
        //         const markedContacts = initializeServerContacts(manuallyAddedContacts);
        //         setUser({
        //             ...user,
        //             apartment: {
        //                 ...user.apartment,
        //                 manuallyAddedContacts: (markedContacts as unknown) as Contact[],
        //             },
        //         });
        //         setTab('Manually Added');
        //     });
        setNewContactError('Sorry, the contact could not be saved.');
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
                        manuallyAddedContacts: markedContacts as Contact[],
                    },
                });
                setMessage('Contact deleted');
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    let content: JSX.Element;
    if (tab === 'Add New Contact') {
        content = (
            <AddContactCell
                handleNewContact={handleNewContact}
                newContactError={newContactError}
                setNewContactError={setNewContactError}
            />
        );
    } else {
        content = <ContactsList handleDelete={handleDeleteContact} contacts={contacts} />;
    }

    return (
        <div className="contacts-container">
            <div className="contacts-tabs-container">
                <Tabs<ContactsTabType>
                    currentTab={tab}
                    setTab={setTab}
                    tabNames={contactsTabNames}
                />
            </div>
            <div className="contacts-error-container">
                {message.length === 0 ? null : (
                    <div className="contacts-error-inner-container">
                        <RedMessageCell message={message} />
                    </div>
                )}
            </div>
            {tab !== 'Add New Contact' ? (
                <div className="contacts-description-container">
                    <ContactsDescriptionCell tab={tab} />
                </div>
            ) : null}
            <div className="contacts-main-content-container">{content}</div>
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
            content = '';
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

export default Contacts;
