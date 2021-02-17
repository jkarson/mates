import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import { getPutOptions, getTenant } from '../../../../common/utilities';
import TenantProfileCellBody from './TenantProfileCellBody';
import InputTenantCell from './InputTenantCell';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';

import '../styles/TenantProfileModificationCell.css';

// EXTENSION: Add e-mail / phone number verification.

const TenantProfileModificationCell: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const tenant = getTenant(user) as Tenant;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState<Tenant>({ ...tenant });
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleClick = () => {
        if (!edit) {
            setEdit(true);
        } else {
            if (input.name.length === 0) {
                setError('Your name cannot be blank');
                return;
            }
            if (serverCallMade) {
                return;
            }
            setServerCallMade(true);
            input.name = input.name.trim();
            input.email = input.email ? input.email.trim() : undefined;
            const data = { apartmentId: user.apartment._id, ...input };
            const options = getPutOptions(data);
            fetch('/mates/updateTenantProfile', options)
                .then((response) => response.json())
                .then((json) => {
                    setServerCallMade(false);
                    const { authenticated, success } = json;
                    if (!authenticated) {
                        setRedirect(true);
                        return;
                    }
                    if (!success) {
                        setError('Sorry, the changes to your profile could not be saved');
                        return;
                    }
                    const { resultTenants } = json;
                    setUser({ ...user, apartment: { ...user.apartment, tenants: resultTenants } });
                    setError('');
                    setEdit(false);
                })
                .catch(() => setError('Sorry, our server seems to be down.'));
        }
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="tenant-profile-modification-cell-container">
            {!edit ? (
                <TenantProfileCellBody tenant={tenant} />
            ) : (
                <InputTenantCell state={input} setState={setInput} />
            )}
            <div className="tenant-profile-modification-cell-icon-container">
                {edit ? (
                    <i className="fa fa-save" onClick={handleClick}></i>
                ) : (
                    <i className="fa fa-pencil" onClick={handleClick}></i>
                )}
            </div>
            <div className="tenant-profile-modification-cell-error-container">
                {!error ? null : <RedMessageCell message={error} />}
            </div>
        </div>
    );
};

export default TenantProfileModificationCell;
