import React from 'react';
import { ProfileInfo } from '../../../../common/models';
import { StateProps } from '../../../../common/types';

// EXTENSION: Add autocomplete and/or verification for address input, perhaps using Google Places API
// https://developers.google.com/maps/documentation/javascript/places-autocomplete

const ApartmentProfileModificationCell: React.FC<StateProps<ProfileInfo>> = ({
    state,
    setState,
}) => {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const name = event.target.name;
        const value = event.target.value;
        setState({ ...state, [name]: value });
    };

    return (
        <form>
            <input
                name="name"
                type="text"
                onChange={handleChange}
                value={state.name}
                style={{ fontSize: 20, fontWeight: 'bold' }}
            />
            <br />
            <label>
                {'Address: '}
                <input
                    name="address"
                    type="text"
                    onChange={handleChange}
                    value={state.address}
                    style={{ width: 300 }}
                />
            </label>
            <br />
            <label>
                {'Quote: '}
                <textarea
                    name="quote"
                    onChange={handleChange}
                    value={state.quote}
                    cols={50}
                    rows={1}
                />
            </label>
        </form>
    );
};

export default ApartmentProfileModificationCell;
