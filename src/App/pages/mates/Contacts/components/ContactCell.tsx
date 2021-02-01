import React, { useState } from 'react';
import { formatPhoneNumber } from '../../../../common/utilities';
import { Contact } from '../models/Contact';
import { getInitials } from '../utilities';
import SimpleButton from '../../../../common/components/SimpleButton';

import '../styles/ContactCell.css';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';

interface ContactCellProps {
    contact: Contact;
    handleDelete: (c: Contact) => void;
}

const ContactCell: React.FC<ContactCellProps> = ({ contact, handleDelete }) => {
    const handleClick = () => handleDelete(contact);

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="contact-cell-container">
            <div className="contact-cell-modal-container">
                <YesNoMessageModal
                    show={showModal}
                    setShow={setShowModal}
                    yesText="Delete"
                    onClickYes={handleClick}
                    message={'Delete contact?'}
                />
            </div>
            <div className="contact-cell-initials-container">
                <Initials name={contact.name} />
            </div>
            <div className="contact-cell-content-container">
                <span>{contact.name}</span>
                {contact.number ? <span>{formatPhoneNumber(contact.number)}</span> : null}
                {contact.email ? <span>{contact.email}</span> : null}
            </div>
            <div className="contact-cell-delete-button-container">
                {contact.manuallyAdded ? (
                    <span onClick={() => setShowModal(true)}>{'X'}</span>
                ) : null}
            </div>
        </div>
    );
};

interface InitialsProps {
    name: string;
}
//to do: modularize
const Initials: React.FC<InitialsProps> = ({ name }) => {
    const initials = getInitials(name);
    return (
        <div className="contact-cell-initials-container">
            <div className="contact-cell-initials-circle">
                <span className="contact-cell-initials-content">{initials}</span>
            </div>
        </div>
    );
};

export default ContactCell;
