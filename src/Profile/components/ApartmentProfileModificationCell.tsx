import React from 'react';
import { Apartment } from '../../Common/models';
import { StateProps } from '../../Common/types';

// EXTENSION: Add autocomplete and/or verification for address input, perhaps using Google Places API
// https://developers.google.com/maps/documentation/javascript/places-autocomplete

const ApartmentProfileModificationCell: React.FC<StateProps<Apartment>> = ({ state, setState }) => {
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
                {'Location: '}
                <input
                    name="location"
                    type="text"
                    onChange={handleChange}
                    value={state.location}
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
