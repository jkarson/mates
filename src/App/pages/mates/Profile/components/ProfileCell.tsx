import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import ModifiableApartmentProfile from './ModifiableApartmentProfile';
import { TenantsProfileCell } from './TenantsProfileCell';

import '../styles/ProfileCell.css';

const ProfileCell: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    return (
        <div className="profile-cell-container">
            <div>
                <div className="profile-cell-apartment-container">
                    <ModifiableApartmentProfile />
                </div>
            </div>
            <div className="profile-cell-tenants-container">
                <TenantsProfileCell
                    tenants={user.apartment.tenants}
                    includesUser={true}
                    userId={user.userId}
                />
            </div>
        </div>
    );
};

export default ProfileCell;
