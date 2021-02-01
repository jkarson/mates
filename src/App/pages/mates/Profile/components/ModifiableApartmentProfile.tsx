import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getPutOptions, getFriendProfileFromApartment } from '../../../../common/utilities';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';
import ApartmentProfileModificationCell from './ApartmentProfileModificationCell';

//to do: disallow leading, trailing whitespace

const ModifiableApartmentProfile: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState(user.apartment.profile);
    const [redirect, setRedirect] = useState(false);
    const [updateProfileError, setUpdateProfileError] = useState(false);

    const handleChange = () => {
        if (edit) {
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
                        setUpdateProfileError(true);
                        return;
                    }
                    const { newProfile } = json;
                    setEdit(false);
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
        <div>
            {!edit ? (
                <ApartmentProfileCellBody
                    apartment={getFriendProfileFromApartment(user.apartment)}
                />
            ) : (
                <ApartmentProfileModificationCell state={input} setState={setInput} />
            )}
            <button onClick={handleChange}>{edit ? 'Save' : 'Edit'}</button>
            {!updateProfileError ? null : (
                <p style={{ color: 'red' }}>{'Your profile could not be saved'}</p>
            )}
        </div>
    );
};

export default ModifiableApartmentProfile;
