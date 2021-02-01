import React, { useState } from 'react';
import BiggerSimpleButton from '../../../../common/components/BiggerSimpleButton';
import FauxSimpleButton, {
    BiggerFauxSimpleButton,
} from '../../../../common/components/FauxSimpleButton';
import SimpleButton from '../../../../common/components/SimpleButton';
import StyledInput from '../../../../common/components/StyledInput';
import { ContactWithoutId } from '../models/Contact';

import '../styles/AddContactCell.css';

//TO DO: don't we limit phone numbers to numbers somewhere?
//control the input!

/*
    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputPhoneNumber = event.target.value;
        if (countDigits(inputPhoneNumber) < countDigits(input.number)) {
            setInput({ ...input, number: getDigits(inputPhoneNumber) });
            return;
        }
        const newCharacter = inputPhoneNumber.charAt(inputPhoneNumber.length - 1);
        if (!isNumberMates(newCharacter)) {
            return;
        }
        setInput({ ...input, number: getDigits(inputPhoneNumber) });
    };
*/

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
}

const AddContactCell: React.FC<AddContactCellProps> = ({ handleNewContact }) => {
    const [formInput, setFormInput] = useState<AddContactState>(emptyAddContactState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormInput({
            ...formInput,
            [event.target.name]: value,
        });
    };

    const handleSubmit = () => {
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
                type="tel"
                name="number"
                value={formInput.number}
                onChange={handleChange}
                placeholder={'Phone Number'}
            />
            <StyledInput
                type="email"
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
            </div>
        </div>
    );
};

export default AddContactCell;
