import React, { useState } from 'react';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';
import { BiggerFauxSimpleButton } from '../../../../common/components/FauxSimpleButtons';
import { BiggerSimpleButton } from '../../../../common/components/SimpleButtons';
import { StyledInput } from '../../../../common/components/StyledInputs';
import {
    countDigits,
    formatPhoneNumber,
    getDigits,
    isNumberMates,
} from '../../../../common/utilities';
import { ContactWithoutId } from '../models/Contact';

import '../styles/AddContactCell.css';

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

interface AddContactCellProps {
    handleNewContact: (c: ContactWithoutId) => void;
    newContactError: string;
    setNewContactError: React.Dispatch<React.SetStateAction<string>>;
}

const AddContactCell: React.FC<AddContactCellProps> = ({
    handleNewContact,
    newContactError,
    setNewContactError,
}) => {
    const [formInput, setFormInput] = useState<AddContactState>(emptyAddContactState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (newContactError !== 'Sorry, our server seems to be down.') {
            setNewContactError('');
        }
        const value = event.target.value;
        if (value !== ' ') {
            setFormInput({
                ...formInput,
                [event.target.name]: value.trimStart(),
            });
        }
    };

    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewContactError('');
        const inputPhoneNumber = event.target.value;
        if (countDigits(inputPhoneNumber) < countDigits(formInput.number)) {
            setFormInput({ ...formInput, number: getDigits(inputPhoneNumber) });
            return;
        }
        const newCharacter = inputPhoneNumber.charAt(inputPhoneNumber.length - 1);
        if (!isNumberMates(newCharacter)) {
            return;
        }
        setFormInput({ ...formInput, number: getDigits(inputPhoneNumber) });
    };

    const handleSubmit = () => {
        if (isValid(formInput)) {
            setFormInput(emptyAddContactState);

            formInput.name = formInput.name.trim();
            formInput.email = formInput.email.trim();

            const newContact: ContactWithoutId = {
                name: formInput.name,
                number: formInput.number,
                email: formInput.email,
                manuallyAdded: true,
            };
            handleNewContact(newContact);
        }
    };

    //EXTENSION: this can grow in complexity to enforce
    //phone numbers and e-mail input, and alert user on invalid input
    const isValid = (input: AddContactState) => {
        return input.name.length > 0;
    };

    return (
        <div className="add-contact-cell-container">
            <StyledInput
                type="text"
                name="name"
                value={formInput.name}
                onChange={handleChange}
                placeholder="* Name"
            />
            <StyledInput
                type="text"
                name="number"
                value={formatPhoneNumber(formInput.number)}
                onChange={handleChangePhoneNumber}
                placeholder={'Phone Number'}
            />
            <StyledInput
                type="text"
                name="email"
                value={formInput.email}
                onChange={handleChange}
                placeholder={'E-mail'}
            />
            <div className="add-contact-cell-buttons-container">
                {isValid(formInput) ? (
                    <BiggerSimpleButton onClick={handleSubmit} text="Save New Contact" />
                ) : (
                    <BiggerFauxSimpleButton text={'Save New Contact'} />
                )}
                <div className="add-contact-cell-error-container">
                    <RedMessageCell message={newContactError} />
                </div>
            </div>
        </div>
    );
};

export default AddContactCell;
