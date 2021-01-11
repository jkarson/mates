import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../common/components/DescriptionCell';
import { AccountContext, AccountContextType } from '../../common/context';
import { User } from '../../common/models';
import { AccountTabType } from './AccountTabs';

// to do / extension : email / address / phone # verification ?
// to do: make input fields larger

// tiny bug: leading whitespace allowed when
// input type=email bc internal onChange not triggered

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
    const { setUser } = useContext(AccountContext) as AccountContextType;
    const [input, setInput] = useState<CreateApartmentCellInput>({
        ...emptyApartmentInput,
        ...emptyTenantInput,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const newValue = event.target.value;
        const newChars = [...newValue];
        if (newChars.every((char) => char === ' ')) {
            setInput({ ...input, [name]: '' });
        } else {
            setInput({ ...input, [name]: newValue });
        }
    };

    // to do: share w TenantProfileModificationCell, perhaps by escalating to common/comp
    const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const lastCharacter = newValue.charAt(newValue.length - 1);
        if (newValue === '0') {
            return;
        }
        if (lastCharacter === ' ' || lastCharacter === '-' || lastCharacter === '.') {
            return;
        } else if (!isNaN(newValue as any)) {
            setInput({ ...input, age: newValue });
        }
    };

    const handleResetApartmentInput = () => {
        setInput({ ...input, ...emptyApartmentInput });
    };

    const handleResetTenantInput = () => {
        setInput({ ...input, ...emptyTenantInput });
    };

    const canCreate = () => input.apartmentName.length > 0 && input.tenantName.length > 0;

    const handleCreateApartment = () => {
        const data = { ...input };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        fetch('/account/createApartment', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated } = json;
                if (!authenticated) {
                    setRedirect(true);
                } else {
                    const { user } = json;
                    setUser({ ...user });
                    setTab('Your Apartments');
                    setInput({ ...emptyApartmentInput, ...emptyTenantInput });
                }
            })
            .catch((error) => console.error(error));
    };

    return (
        <div>
            <DescriptionCell
                content={
                    'Initialize a new apartment. Required fields are marked with an asterisk (*). Other users may request to join your apartment after it is created. Only the apartment name and tenant names will be publicly searchable.'
                }
            />
            <h3>{'Apartment Profile Information'}</h3>
            <label>
                {'Apartment Name*'}
                <input
                    type="text"
                    value={input.apartmentName}
                    onChange={handleChange}
                    name={'apartmentName'}
                />
            </label>
            <br />
            <label>
                {'Address'}
                <input type="text" value={input.address} onChange={handleChange} name="address" />
            </label>
            <br />
            <label>
                {'Quote'}
                <input type="text" value={input.quote} onChange={handleChange} name="quote" />
            </label>
            <br />
            <button onClick={handleResetApartmentInput}>{'Reset'}</button>
            <h3>{'Tenant Information'}</h3>
            <label>
                {'Your Name*'}
                <input
                    type="text"
                    value={input.tenantName}
                    onChange={handleChange}
                    name="tenantName"
                />
            </label>
            <br />
            <label>
                {'Your Age'}
                <input type="text" value={input.age} onChange={handleChangeAge} />
            </label>
            <br />
            <label>
                {'Your E-mail'}
                <input type="email" value={input.email} onChange={handleChange} name="email" />
            </label>
            <br />
            <label>
                {'Your Phone Number'}
                <input type="text" value={input.number} onChange={handleChange} name="number" />
            </label>
            <br />
            <button onClick={handleResetTenantInput}>{'Reset'}</button>
            <br />
            <br />
            <br />
            {!canCreate() ? null : (
                <button onClick={handleCreateApartment}>{'Create Apartment'}</button>
            )}
            {!redirect ? null : <Redirect to="/" />}
        </div>
    );
};

export default CreateApartmentCell;
