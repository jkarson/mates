import React, { useContext, useState } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { getFriendProfileFromApartment } from '../../../common/utilities';
import ApartmentProfileCellBody from '../../mates/Profile/components/ApartmentProfileCellBody';
import ApartmentProfileModificationCell from '../../mates/Profile/components/ApartmentProfileModificationCell';

const DemoModifiableApartmentProfile: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState(user.apartment.profile);

    const handleChange = () => {
        if (edit) {
            user.apartment.profile = { ...input };
            setUser({ ...user });
            setEdit(false);
        } else {
            setEdit(true);
        }
    };

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
        </div>
    );
};

export default DemoModifiableApartmentProfile;
