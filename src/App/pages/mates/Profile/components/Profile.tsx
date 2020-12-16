import React, { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../../../common/context';
import { Tenant, TenantId } from '../../../../common/models';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';
import ApartmentProfileModificationCell from './ApartmentProfileModificationCell';
import TenantProfileCellBody from './TenantProfileCellBody';
import TenantProfileModificationCell from './TenantProfileModificationCell';

//EXTENSION: Could incorporate birthdays, calculate age automatically,
//send a notification, make it pretty, etc

//EXTENSION: add photo to apartment profile

//EXTENSION: Make profiles more customizable, perhaps text colors and perhaps individual-level
// photos

//EXTENSION: Quotes for individuals

const Profile: React.FC = () => {
    const { user } = useContext(UserContext) as UserContextType;
    return (
        <div>
            <ModifiableApartmentProfile />
            <TenantsProfileCell
                tenants={user.apartment.tenants}
                includesUser={true}
                userId={user.tenantId}
            />
        </div>
    );
};

const ModifiableApartmentProfile: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState(user.apartment);
    const handleChange = () => {
        if (edit) {
            setEdit(false);
            //TO DO: SAVE TO DATABASE! note that friends need to be updated too when this changes
            setUser({ ...user, apartment: input });
        } else {
            setEdit(true);
        }
    };
    return (
        <div>
            {!edit ? (
                <ApartmentProfileCellBody apartment={user.apartment} />
            ) : (
                <ApartmentProfileModificationCell state={input} setState={setInput} />
            )}
            <button onClick={handleChange}>{edit ? 'Save' : 'Edit'}</button>
        </div>
    );
};

interface TenantsProfileCellProps {
    tenants: Tenant[];
    includesUser: boolean;
    userId?: TenantId;
}

export const TenantsProfileCell: React.FC<TenantsProfileCellProps> = ({
    tenants,
    includesUser,
    userId,
}) => {
    tenants.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
    return (
        <div>
            {tenants.map((tenant: Tenant) => {
                if (includesUser && userId === tenant.id) {
                    return <TenantProfileModificationCell key={tenant.id} />;
                } else {
                    return <TenantProfileCellBody tenant={tenant} key={tenant.id} />;
                }
            })}
        </div>
    );
};

export default Profile;
