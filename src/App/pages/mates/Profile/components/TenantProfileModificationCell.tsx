import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import { StateProps } from '../../../../common/types';
import { getPutOptions, getTenant } from '../../../../common/utilities';
import TenantProfileCellBody from './TenantProfileCellBody';

// EXTENSION: Add e-mail / phone number verification.
// If email is used for the server, Re-configure as "public display email" or "toggle display"

const TenantProfileModificationCell: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const tenant = getTenant(user) as Tenant;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState<Tenant>({ ...tenant });
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const handleClick = () => {
        if (!edit) {
            setEdit(true);
        } else {
            //const { apartment } = user;
            //const tenantIndex = apartment.tenants.indexOf(tenant);
            //apartment.tenants.splice(tenantIndex, 1, input);
            //TO DO: SAVE TO DATABASE!
            const data = { apartmentId: user.apartment._id, ...input };
            const options = getPutOptions(data);
            fetch('/mates/updateTenantProfile', options)
                .then((response) => response.json())
                .then((json) => {
                    const { authenticated, success } = json;
                    if (!authenticated) {
                        setRedirect(true);
                        return;
                    }
                    if (!success) {
                        setError(true);
                        return;
                    }
                    const { resultTenants } = json;
                    setUser({ ...user, apartment: { ...user.apartment, tenants: resultTenants } });
                    setEdit(false);
                });
        }
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            {!edit ? (
                <TenantProfileCellBody tenant={tenant} />
            ) : (
                <InputTenantCell state={input} setState={setInput} />
            )}
            <button onClick={handleClick}>{edit ? 'Save' : 'Edit'}</button>
            {!error ? null : (
                <p style={{ color: 'red' }}>{'Unable to save changes to your profile'}</p>
            )}
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

export default TenantProfileModificationCell;
