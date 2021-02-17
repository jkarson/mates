import React, { useState, useContext, useEffect } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Apartment } from '../../../common/models';
import { assertUnreachable } from '../../../common/utilities';
import AddContactCell from '../../mates/Contacts/components/AddContactCell';
import { ContactsDescriptionCell, ContactsList } from '../../mates/Contacts/Contacts';
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
            setMessage('Contact deleted.');
        }
    };

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

export default DemoContacts;
