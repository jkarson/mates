import React from 'react';
import { Contact } from '../models/Contact';
import { getInitials } from '../utilities';

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

interface InitialsProps {
    name: string;
}

const Initials: React.FC<InitialsProps> = ({ name }) => {
    const initials = getInitials(name);
    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    borderRadius: '50%',
                    border: '1px solid blue',
                    width: 40,
                    height: 40,
                    marginTop: 5,
                    marginBottom: -5,
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <span
                    style={{
                        textAlign: 'center',
                        flex: 1,
                    }}
                >
                    {initials}
                </span>
            </div>
        </div>
    );
};

export default ContactCell;
