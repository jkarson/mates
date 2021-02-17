import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
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
            user.apartment.profile = { ...input };
            setEdit(false);
            setUpdateProfileError('');
            setUser({ ...user });
        } else {
            setEdit(true);
        }
    };

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

export default DemoModifiableApartmentProfile;
