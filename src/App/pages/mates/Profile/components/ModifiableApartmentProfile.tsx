import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getPutOptions, getFriendProfileFromApartment } from '../../../../common/utilities';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';
import ApartmentProfileModificationCell from './ApartmentProfileModificationCell';

import '../styles/ModifiableApartmentProfile.css';
import RedMessageCell from '../../../../common/components/RedMessageCell';

const ModifiableApartmentProfile: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState(user.apartment.profile);
    const [redirect, setRedirect] = useState(false);
    const [updateProfileError, setUpdateProfileError] = useState('');

    const handleChange = () => {
        if (edit && input.name.length === 0) {
            setUpdateProfileError('Apartment name cannot be empty');
            return;
        }
        if (edit) {
            input.name = input.name.trim();
            input.address = input.address ? input.address.trim() : input.address;
            input.quote = input.quote ? input.quote.trim() : input.quote;
            const data = {
                name: input.name,
                address: input.address,
                quote: input.quote,
                apartmentId: user.apartment._id,
            };
            const options = getPutOptions(data);
            fetch('/mates/updateApartmentProfile', options)
                .then((response) => response.json())
                .then((json) => {
                    const { authenticated, success } = json;
                    if (!authenticated) {
                        setRedirect(true);
                        return;
                    }
                    if (!success) {
                        setUpdateProfileError('Sorry, your profile could not be saved');
                        return;
                    }
                    const { newProfile } = json;
                    setEdit(false);
                    setUpdateProfileError('');
                    setUser({ ...user, apartment: { ...user.apartment, profile: newProfile } });
                });
        } else {
            setEdit(true);
        }
    };
    if (redirect) {
        return <Redirect to="/" />;
    }
    return (
        <div className="modifiable-apartment-profile-container">
            <div className="modifiable-apartment-profile-content-container">
                {!edit ? (
                    <ApartmentProfileCellBody
                        apartment={getFriendProfileFromApartment(user.apartment)}
                    />
                ) : (
                    <ApartmentProfileModificationCell state={input} setState={setInput} />
                )}
                <div className="modifiable-apartment-profile-icon-container">
                    {edit ? (
                        <i className="fa fa-save" onClick={handleChange}></i>
                    ) : (
                        <i className="fa fa-pencil" onClick={handleChange}></i>
                    )}
                </div>
            </div>
            <div className="modifiable-apartment-profile-error-container">
                {updateProfileError.length === 0 ? null : (
                    <RedMessageCell message={updateProfileError} />
                )}
            </div>
        </div>
    );
};

export default ModifiableApartmentProfile;
