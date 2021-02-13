import React, { useState } from 'react';
import { formatPhoneNumber } from '../../../../common/utilities';
import { Contact } from '../models/Contact';
import { getInitials } from '../utilities';

import '../styles/ContactCell.css';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import SimpleButton from '../../../../common/components/SimpleButton';

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
                <div className="contact-cell-name-container">
                    <span>{contact.name}</span>
                </div>
                {contact.number ? (
                    <div className="contact-cell-number-container">
                        <span>{formatPhoneNumber(contact.number)}</span>
                    </div>
                ) : null}
                {contact.email ? (
                    <div className="contact-cell-email-container">
                        <span>{contact.email}</span>
                    </div>
                ) : null}
            </div>
            <div className="contact-cell-delete-button-container">
                {contact.manuallyAdded ? (
                    <SimpleButton onClick={() => setShowModal(true)} text="Delete Contact" />
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
