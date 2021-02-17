import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import { BiggerFauxSimpleButton } from '../../../common/components/FauxSimpleButtons';
import { BiggerSimpleButton, SimpleButton } from '../../../common/components/SimpleButtons';
import { SmallerStyledInput } from '../../../common/components/StyledInputs';
import { AccountContext, AccountContextType } from '../../../common/context';
import {
    verifyAgeInput,
    countDigits,
    getDigits,
    getPostOptions,
    formatPhoneNumber,
    isNumberMates,
} from '../../../common/utilities';
import { AccountTabType } from '../models/AccountTabs';

import '../styles/CreateApartmentCell.css';

// extension : email / address / phone # verification, if appropriate

interface CreateApartmentCellInput {
    apartmentName: string;
    address: string;
    quote: string;
    tenantName: string;
    age: string;
    email: string;
    number: string;
}

const emptyApartmentInput = {
    apartmentName: '',
    address: '',
    quote: '',
};

const emptyTenantInput = {
    tenantName: '',
    age: '',
    email: '',
    number: '',
};

interface CreateApartmentCellProps {
    setTab: React.Dispatch<React.SetStateAction<AccountTabType>>;
}

const CreateApartmentCell: React.FC<CreateApartmentCellProps> = ({ setTab }) => {
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    const { setUser } = useContext(AccountContext) as AccountContextType;
    const [input, setInput] = useState<CreateApartmentCellInput>({
        ...emptyApartmentInput,
        ...emptyTenantInput,
    });
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const newValue = event.target.value;
        if (newValue === ' ') {
            return;
        }
        setInput({ ...input, [name]: newValue.trimStart() });
    };

    const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
        const verifiedInput = verifyAgeInput(event.target.value);
        if (verifiedInput) {
            setInput({ ...input, age: event.target.value });
        }
    };

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

    const handleResetApartmentInput = () => {
        setInput({ ...input, ...emptyApartmentInput });
    };

    const handleResetTenantInput = () => {
        setInput({ ...input, ...emptyTenantInput });
    };

    const canCreate = () => input.apartmentName.length > 0 && input.tenantName.length > 0;

    const handleCreateApartment = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        input.apartmentName = input.apartmentName.trim();
        input.address = input.address.trim();
        input.quote = input.quote.trim();
        input.tenantName = input.tenantName.trim();
        input.email = input.email.trim();
        input.age = input.age.trim();
        input.number = input.number.trim();
        const data = { ...input };
        const options = getPostOptions(data);
        fetch('/account/createApartment', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                } else if (!success) {
                    setMessage('Sorry, your apartment could not be created at this time');
                } else {
                    const { user } = json;
                    setUser({ ...user });
                    setMessage('');
                    setInput({ ...emptyApartmentInput, ...emptyTenantInput });
                    setTab('Your Apartments');
                }
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="create-apartment-cell-container">
            <div className="create-apartment-cell-apartment-header">
                <h3>{'Your Apartment'}</h3>
            </div>
            <div className="create-apartment-cell-tenant-header">
                <h3>{'You'}</h3>
            </div>
            <div className="create-apartment-cell-apartment-container">
                <SmallerStyledInput
                    type="text"
                    value={input.apartmentName}
                    onChange={handleChange}
                    name={'apartmentName'}
                    placeholder={'*Apartment Name'}
                />
                <SmallerStyledInput
                    type="text"
                    value={input.address}
                    onChange={handleChange}
                    name={'address'}
                    placeholder={'Address'}
                />
                <SmallerStyledInput
                    type="text"
                    value={input.quote}
                    onChange={handleChange}
                    name="quote"
                    placeholder={'Quote (e.g., "Can I have the last La Croix?")'}
                />
            </div>
            <div className="create-apartment-cell-clear-apartment-container">
                <SimpleButton onClick={handleResetApartmentInput} text={'Clear'} />
            </div>

            <div className="create-apartment-cell-tenant-container">
                <SmallerStyledInput
                    type="text"
                    value={input.tenantName}
                    onChange={handleChange}
                    name="tenantName"
                    placeholder={'*Your Name'}
                />

                <SmallerStyledInput
                    type="text"
                    value={input.age}
                    onChange={handleChangeAge}
                    name="age"
                    placeholder={'Age'}
                />
                <SmallerStyledInput
                    type="text"
                    value={input.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="E-mail address"
                />
                <SmallerStyledInput
                    type="text"
                    value={formatPhoneNumber(input.number)}
                    onChange={handleChangePhoneNumber}
                    name="number"
                    placeholder="Phone Number"
                />
            </div>
            <div className="create-apartment-cell-clear-tenant-container">
                <SimpleButton onClick={handleResetTenantInput} text={'Clear'} />
            </div>
            <div className="create-apartment-cell-create-button-outer-container">
                {!canCreate() ? (
                    <div>
                        <BiggerFauxSimpleButton text="Create Apartment" />
                    </div>
                ) : (
                    <div className="create-apartment-cell-create-button-container">
                        <BiggerSimpleButton
                            onClick={handleCreateApartment}
                            text="Create Apartment"
                        />
                    </div>
                )}
                <div className="create-apartment-cell-message-container">
                    {message.length === 0 ? null : <RedMessageCell message={message} />}
                </div>
            </div>
        </div>
    );
};

export default CreateApartmentCell;
