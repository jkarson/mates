import React from 'react';
import { StyledInput } from '../../../../common/components/StyledInputs';
import { StateProps } from '../../../../common/types';
import { ProfileInfo } from '../models/ProfileInfo';

import '../styles/ApartmentProfileModificationCell.css';

// EXTENSION: Add autocomplete and/or verification for address input, perhaps using Google Places API

const ApartmentProfileModificationCell: React.FC<StateProps<ProfileInfo>> = ({
    state,
    setState,
}) => {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const name = event.target.name;
        const value = event.target.value;
        if (value === ' ') {
            return;
        }
        setState({ ...state, [name]: value.trimStart() });
    };

    return (
        <div className="apartment-profile-modification-cell-container">
            <StyledInput
                name="name"
                type="text"
                onChange={handleChange}
                value={state.name}
                placeholder={'Apartment Name'}
            />
            <StyledInput
                name="address"
                type="text"
                onChange={handleChange}
                value={state.address}
                placeholder={'Address'}
            />
            <StyledInput
                name="quote"
                onChange={handleChange}
                value={state.quote}
                placeholder={'Quote (e.g., "Can I have the last La Croix?")'}
            />
        </div>
    );
};

export default ApartmentProfileModificationCell;
