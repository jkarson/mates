import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../common/components/DescriptionCell';
import { AccountContext, AccountContextType } from '../../common/context';
import { ApartmentId, ApartmentSummary } from '../../common/models';
import { formatNames } from '../../common/utilities';
import { AccountTabType } from './AccountTabs';

//might want to get a utility for formatting post request options,
//since im doing it exactly the same every time

interface JoinApartmentCellProps {
    setTab: React.Dispatch<React.SetStateAction<AccountTabType>>;
}

const JoinApartmentCell: React.FC<JoinApartmentCellProps> = ({ setTab }) => {
    const [redirect, setRedirect] = useState(false);
    const [apartmentCodeInput, setApartmentCodeInput] = useState('');
    const [showCodeError, setShowCodeError] = useState(false);
    const [showJoinError, setShowJoinError] = useState(false);
    const [apartmentSummary, setApartmentSummary] = useState<ApartmentSummary | null>(null);
    const { setUser } = useContext(AccountContext) as AccountContextType;

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApartmentCodeInput(event.target.value);
        setShowCodeError(false);
        setApartmentSummary(null);
    };

    const handleSearch = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: apartmentCodeInput }),
        };
        fetch('/account/searchCode', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                const { apartment } = json;
                if (!apartment) {
                    setShowCodeError(true);
                    return;
                }
                setApartmentSummary(apartment);
            })
            .catch((err) => console.error(err));
    };

    const handleClickJoin = (apartmentId: ApartmentId) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apartmentId: apartmentId }),
        };
        fetch('/account/requestToJoin', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setShowJoinError(true);
                    return;
                }
                const { user } = json;
                setUser({ ...user });
                setTab('Your Join Requests');
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <DescriptionCell
                content={'Search an apartment by unique code. Then, request to join.'}
            />
            <label>
                {'Unique Code:'}
                <input type="text" value={apartmentCodeInput} onChange={handleChangeInput} />
            </label>
            <button onClick={handleSearch}>{'Search'}</button>
            {!showCodeError ? null : (
                <p style={{ color: 'red' }}>{'Sorry, this apartment code is invalid.'}</p>
            )}
            {!apartmentSummary ? null : (
                <JoinCell apartmentSummary={apartmentSummary} handleClickJoin={handleClickJoin} />
            )}
            {!showJoinError ? null : (
                <p style={{ color: 'red' }}>{'Sorry, your join request could not be completed'}</p>
            )}
            {!redirect ? null : <Redirect to="/" />}
        </div>
    );
};

interface JoinCellProps {
    apartmentSummary: ApartmentSummary;
    handleClickJoin: (apartmentId: ApartmentId) => void;
}

const JoinCell: React.FC<JoinCellProps> = ({ apartmentSummary, handleClickJoin }) => (
    <div>
        <h3>{apartmentSummary.name}</h3>
        <p>{formatNames(apartmentSummary.tenantNames)}</p>
        <button onClick={() => handleClickJoin(apartmentSummary.apartmentId)}>
            {'Request To Join'}
        </button>
    </div>
);

export default JoinApartmentCell;
