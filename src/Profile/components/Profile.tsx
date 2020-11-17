import React, { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartment, Tenant } from '../../Common/models';
import { StateProps, TenantId } from '../../Common/types';
import { getTenant } from '../../Common/utilities';

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
            <Tenants tenants={user.apartment.tenants} includesUser={true} userId={user.tenantId} />
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
            //TO DO: SAVE TO DATABASE!
            setUser({ ...user, apartment: input });
        } else {
            setEdit(true);
        }
    };
    return (
        <div>
            {!edit ? (
                <ApartmentProfileBody apartment={user.apartment} />
            ) : (
                <ApartmentProfileInput state={input} setState={setInput} />
            )}
            <button onClick={handleChange}>{edit ? 'Save' : 'Edit'}</button>
        </div>
    );
};

interface ApartmentProfileBodyProps {
    apartment: Apartment;
}

const ApartmentProfileBody: React.FC<ApartmentProfileBodyProps> = ({ apartment }) => (
    <div>
        <h1>{apartment.name}</h1>
        <p>{apartment.location}</p>
        <p style={{ color: 'blue' }}>{apartment.quote ? '"' + apartment.quote + '"' : null}</p>
    </div>
);

const ApartmentProfileInput: React.FC<StateProps<Apartment>> = ({ state, setState }) => {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const name = event.target.name;
        const value = event.target.value;
        setState({ ...state, [name]: value });
    };

    //TO DO: can i get an address type for the location input?
    //all these fields are gonna need validation at some point...
    //or do they? would be cool for this to have a relatively unregulated feel too

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

interface TenantsProps {
    tenants: Tenant[];
    includesUser: boolean;
    userId?: TenantId;
}

const Tenants: React.FC<TenantsProps> = ({ tenants, includesUser, userId }) => {
    tenants.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
    return (
        <div>
            {tenants.map((tenant: Tenant) => {
                if (includesUser && userId === tenant.id) {
                    return <ModifiableTenantCell key={tenant.id} />;
                } else {
                    return <TenantCellBody tenant={tenant} key={tenant.id} />;
                }
            })}
        </div>
    );
};

interface TenantCellBodyProps {
    tenant: Tenant;
}

const TenantCellBody: React.FC<TenantCellBodyProps> = ({ tenant }) => (
    <div style={{ padding: 5 }}>
        <h3>{tenant.name}</h3>
        <p>{tenant.age ? 'age: ' + tenant.age : null}</p>
        <p>{tenant.email ? 'email: ' + tenant.email : null}</p>
        <p>{tenant.number ? 'number: ' + tenant.number : null}</p>
    </div>
);

const ModifiableTenantCell: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const tenant = getTenant(user) as Tenant;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState<Tenant>({ ...tenant });

    const handleClick = () => {
        if (!edit) {
            setEdit(true);
        } else {
            const { apartment } = user;
            const tenantIndex = apartment.tenants.indexOf(tenant);
            apartment.tenants.splice(tenantIndex, 1, input);
            //TO DO: SAVE TO DATABASE!
            setUser({ ...user, apartment: apartment });
            setEdit(false);
        }
    };

    return (
        <div>
            {!edit ? (
                <TenantCellBody tenant={tenant} />
            ) : (
                <InputTenantCell state={input} setState={setInput} />
            )}
            <button onClick={handleClick}>{edit ? 'Save' : 'Edit'}</button>
        </div>
    );
};

const InputTenantCell: React.FC<StateProps<Tenant>> = ({ state, setState }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setState({ ...state, [name]: value });
    };

    return (
        <div style={{ padding: 5 }}>
            <form>
                <input
                    name="name"
                    type="text"
                    value={state.name}
                    style={{ fontWeight: 'bold' }}
                    onChange={handleChange}
                />
                <br />
                <label>
                    {'Age: '}
                    <input name="age" type="number" value={state.age} onChange={handleChange} />
                </label>
                <br />
                <label>
                    {'E-Mail: '}
                    <input name="email" type="email" value={state.email} onChange={handleChange} />
                </label>
                <br />
                <label>
                    {'Phone Number: '}
                    <input name="number" type="tel" value={state.number} onChange={handleChange} />
                </label>
            </form>
        </div>
    );
};

export default Profile;

interface StaticApartmentProfileProps {
    apartment: Apartment;
}

//used to output static profiles by Friends module
const StaticApartmentProfile: React.FC<StaticApartmentProfileProps> = ({ apartment }) => (
    <div>
        <ApartmentProfileBody apartment={apartment} />
        <Tenants tenants={apartment.tenants} includesUser={false} />
    </div>
);

export { StaticApartmentProfile };
