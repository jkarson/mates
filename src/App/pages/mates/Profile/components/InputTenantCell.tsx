import React from 'react';
import { StyledInput } from '../../../../common/components/StyledInputs';
import { Tenant } from '../../../../common/models';
import { StateProps } from '../../../../common/types';
import {
    verifyAgeInput,
    countDigits,
    getDigits,
    isNumberMates,
    formatPhoneNumber,
} from '../../../../common/utilities';

import '../styles/InputTenantCell.css';

const InputTenantCell: React.FC<StateProps<Tenant>> = ({ state, setState }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        if (value === ' ') {
            return;
        }
        setState({ ...state, [name]: value.trimStart() });
    };

    const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
        const verifiedInput = verifyAgeInput(event.target.value);
        if (verifiedInput) {
            setState({ ...state, age: event.target.value });
        }
    };

    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numberInState = state.number ? state.number : '';
        const inputPhoneNumber = event.target.value;
        if (countDigits(inputPhoneNumber) < countDigits(numberInState)) {
            setState({ ...state, number: getDigits(inputPhoneNumber) });
            return;
        }
        const newCharacter = inputPhoneNumber.charAt(inputPhoneNumber.length - 1);
        if (!isNumberMates(newCharacter)) {
            return;
        }
        setState({ ...state, number: getDigits(inputPhoneNumber) });
    };

    return (
        <div className="input-tenant-cell-container-outer">
            <div className="input-tenant-cell-container-inner">
                <StyledInput
                    name="name"
                    type="text"
                    value={state.name}
                    onChange={handleChange}
                    placeholder={'Name'}
                />
                <StyledInput
                    name="age"
                    type="text"
                    value={state.age ? state.age : ''}
                    onChange={handleChangeAge}
                    placeholder={'Age: '}
                />
                <StyledInput
                    name="email"
                    type="text"
                    value={state.email ? state.email : ''}
                    onChange={handleChange}
                    placeholder={'E-Mail'}
                />
                <StyledInput
                    name="number"
                    type="text"
                    value={state.number ? formatPhoneNumber(state.number) : ''}
                    onChange={handleChangePhoneNumber}
                    placeholder={'Phone Number'}
                />
            </div>
        </div>
    );
};

export default InputTenantCell;
