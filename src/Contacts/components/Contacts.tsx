import React, { useState, useContext } from 'react';
import { Contact, ContactWithoutId } from '../models/Contact';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartment, Tenant } from '../../Common/models';
import { assertUnreachable, getNewId } from '../../Common/utilities';
import Initials from './Initials';
import Tabs from '../../Common/components/Tabs';

//EXTENSION: each Contact / tab could be color coded by type of contact

//EXTENSION: Manually added contacts can have manually added photos; other contacts have photos
//as defined in profile

const tabNames = ['All', 'Your Apartment', 'Friends', 'Manually Added', 'Add New Contact'] as const;
type ContactsTabType = typeof tabNames[number];

const Contacts: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    const [tab, setTab] = useState<ContactsTabType>('All');

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
            <Tabs<ContactsTabType> currentTab={tab} setTab={setTab} tabNames={tabNames} />
            {tab === 'All' ? <DescriptionCell /> : null}
            {tab === 'Add New Contact' ? (
                <AddContact handleNewContact={handleNewContact} />
            ) : (
                <ContactsList handleDelete={handleDeleteContact} contacts={contacts} />
            )}
        </div>
    );
};

const DescriptionCell: React.FC = () => (
    <p style={{ fontWeight: 'bold' }}>{'Only manually added contacts can be deleted.'}</p>
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

interface AddContactState {
    name: string;
    number: string;
    email: string;
}

const emptyAddContactState: AddContactState = {
    name: '',
    number: '',
    email: '',
};

interface AddContactProps {
    handleNewContact: (c: ContactWithoutId) => void;
}

const AddContact: React.FC<AddContactProps> = ({ handleNewContact }) => {
    const [formInput, setFormInput] = useState<AddContactState>(emptyAddContactState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormInput({
            ...formInput,
            [event.target.name]: value,
        });
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (isValid(formInput)) {
            setFormInput(emptyAddContactState);
            const newContact: ContactWithoutId = {
                name: formInput.name,
                number: formInput.number,
                email: formInput.email,
                manuallyAdded: true,
            };
            handleNewContact(newContact);
        }
    };

    return (
        <div>
            <form>
                <label>
                    {'Name (required)'}
                    <input type="text" name="name" value={formInput.name} onChange={handleChange} />
                </label>
                <br />
                <label>
                    {'Phone Number (optional'}
                    <input
                        type="tel"
                        name="number"
                        value={formInput.number}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    {'E-mail Address (optional)'}
                    <input
                        type="email"
                        name="email"
                        value={formInput.email}
                        onChange={handleChange}
                    />
                </label>
                <br />
            </form>
            <button onClick={handleSubmit}>{'Create New Contact'}</button>
        </div>
    );
};

//EXTENSION: this can grow in complexity to enforce
//phone numbers and e-mail input, and alert user on invalid input
const isValid = (input: AddContactState) => {
    return input.name.length > 0;
};

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

interface ContactCellProps {
    contact: Contact;
    handleDelete: (c: Contact) => void;
}

const ContactCell: React.FC<ContactCellProps> = ({ contact, handleDelete }) => {
    const handleClick = () => handleDelete(contact);

    return (
        <div style={{ borderTop: '1px solid black', marginTop: 5, marginBottom: 5 }}>
            <Initials name={contact.name} />

            <p>{'Name: ' + contact.name}</p>
            {contact.number ? <p>{'Number: ' + contact.number}</p> : null}
            {contact.email ? <p>{'Email: ' + contact.email}</p> : null}
            {contact.manuallyAdded ? (
                <button onClick={handleClick}>{'Delete Contact'}</button>
            ) : null}
        </div>
    );
};

export default Contacts;
