import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import { BiggerSimpleButton } from '../../../common/components/SimpleButtons';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { StyledInput } from '../../../common/components/StyledInputs';
import { AccountContext, AccountContextType } from '../../../common/context';
import { ApartmentId } from '../../../common/models';
import { getPostOptions } from '../../../common/utilities';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';
import { AccountTabType } from '../models/AccountTabs';
import JoinCell from './JoinCell';

import '../styles/JoinApartmentCell.css';

interface JoinApartmentCellProps {
    setTab: React.Dispatch<React.SetStateAction<AccountTabType>>;
}

const JoinApartmentCell: React.FC<JoinApartmentCellProps> = ({ setTab }) => {
    const [redirect, setRedirect] = useState(false);
    const [apartmentCodeInput, setApartmentCodeInput] = useState('');
    const [showCodeError, setShowCodeError] = useState('');
    const [showJoinError, setShowJoinError] = useState('');
    const [apartmentSummary, setApartmentSummary] = useState<ApartmentSummary | null>(null);
    const [serverCallMade, setServerCallMade] = useState(false);
    const { setUser } = useContext(AccountContext) as AccountContextType;

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApartmentCodeInput(event.target.value);
        setApartmentSummary(null);
        if (showCodeError !== 'Sorry, our server seems to be down.') {
            setShowCodeError('');
        }
        setShowJoinError('');
    };

    const handleSearch = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const options = getPostOptions({ code: apartmentCodeInput });
        fetch('/account/searchCode', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                setShowCodeError('');
                const { authenticated } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                const { apartment } = json;
                if (!apartment) {
                    setShowCodeError('Sorry, this apartment code is invalid.');
                    return;
                }
                setApartmentSummary(apartment);
            })
            .catch(() => setShowCodeError('Sorry, our server seems to be down.'));
    };

    const handleClickJoin = (apartmentId: ApartmentId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const options = getPostOptions({ apartmentId: apartmentId });
        fetch('/account/requestToJoin', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                setShowJoinError('');
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setShowJoinError('Sorry, your join request could not be completed.');
                    return;
                }
                const { user } = json;
                setUser({ ...user });
                setTab('Your Join Requests');
            })
            .catch(() => setShowJoinError('Sorry, our server seems to be down.'));
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
                {showCodeError.length === 0 ? null : <RedMessageCell message={showCodeError} />}
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
                    {showJoinError.length === 0 ? null : <RedMessageCell message={showJoinError} />}
                </div>
            </div>
        </div>
    );
};

export default JoinApartmentCell;
