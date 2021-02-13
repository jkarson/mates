import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import BiggerSimpleButton from '../../../common/components/BiggerSimpleButton';
import RedMessageCell from '../../../common/components/RedMessageCell';
import StandardStyledText from '../../../common/components/StandardStyledText';
import StyledInput from '../../../common/components/StyledInput';
import { AccountContext, AccountContextType } from '../../../common/context';
import { ApartmentId } from '../../../common/models';
import { getPostOptions } from '../../../common/utilities';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';
import { AccountTabType } from '../models/AccountTabs';

import '../styles/JoinApartmentCell.css';
import JoinCell from './JoinCell';

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
        setShowJoinError(false);
    };

    const handleSearch = () => {
        const options = getPostOptions({ code: apartmentCodeInput });
        fetch('/account/searchCode', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
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

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="join-apartment-cell-container">
            <div className="join-apartment-cell-text">
                <StandardStyledText
                    text={
                        "To join an existing apartment, ask one of its members for the apartment's unique code. Then, enter the code below."
                    }
                />
            </div>
            <div className="join-apartment-cell-search">
                <StyledInput type="text" value={apartmentCodeInput} onChange={handleChangeInput} />
                <BiggerSimpleButton onClick={handleSearch} text={'Search'} />
                {!showCodeError ? null : (
                    <RedMessageCell message={'Sorry, this apartment code is invalid.'} />
                )}
            </div>
            <div className="join-apartment-cell-join-cell-container">
                {!apartmentSummary ? null : (
                    <div className="join-apartment-cell-join-cell-inner-container">
                        <JoinCell
                            apartmentSummary={apartmentSummary}
                            handleClickJoin={handleClickJoin}
                        />
                    </div>
                )}
                <div className="join-apartment-cell-error">
                    {!showJoinError ? null : (
                        <RedMessageCell
                            message={'Sorry, your join request could not be completed'}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinApartmentCell;
