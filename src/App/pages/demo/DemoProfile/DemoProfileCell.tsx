import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import DemoModifiableApartmentProfile from './DemoModifiableApartmentProfile';
import { DemoTenantsProfileCell } from './DemoTenantsProfileCell';

const DemoProfileCell: React.FC = () => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    return (
        <div className="profile-cell-container">
            <div>
                <div className="profile-cell-apartment-container">
                    <DemoModifiableApartmentProfile />
                </div>
            </div>
            <div className="profile-cell-tenants-container">
                <DemoTenantsProfileCell
                    tenants={user.apartment.tenants}
                    includesUser={true}
                    userId={user.userId}
                />
            </div>
        </div>
    );
};

export default DemoProfileCell;
