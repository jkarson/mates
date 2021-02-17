import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { Tenant } from '../../../common/models';
import { getTenant } from '../../../common/utilities';
import InputTenantCell from '../../mates/Profile/components/InputTenantCell';
import TenantProfileCellBody from '../../mates/Profile/components/TenantProfileCellBody';

const DemoTenantProfileModificationCell: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const tenant = getTenant(user) as Tenant;
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState<Tenant>({ ...tenant });
    const [error, setError] = useState('');

    const handleClick = () => {
        if (!edit) {
            setEdit(true);
        } else {
            if (input.name.length === 0) {
                setError('Your name cannot be blank');
                return;
            }
            tenant.name = input.name.trim();
            tenant.age = input.age;
            tenant.email = input.email ? input.email.trim() : undefined;
            tenant.number = input.number;
            setUser({ ...user });
            setError('');
            setEdit(false);
        }
    };

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

export default DemoTenantProfileModificationCell;
