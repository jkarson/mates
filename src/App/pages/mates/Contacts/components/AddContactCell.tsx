import React, { useState } from 'react';
import { ContactWithoutId } from '../models/Contact';

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

export default AddContactCell;
