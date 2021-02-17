import React, { useContext, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { AccountContext, AccountContextType } from '../../../common/context';
import { ApartmentId } from '../../../common/models';
import { getPostOptions } from '../../../common/utilities';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';
import ApartmentCell from './ApartmentCell';

import '../styles/ApartmentsCell.css';

const ApartmentsCell: React.FC<RouteComponentProps> = ({ history }) => {
    const userContext = useContext(AccountContext) as AccountContextType;

    const { user, setUser } = userContext;
    const apartmentSummaries: ApartmentSummary[] = user.apartments;
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleClickViewApartment = (apartmentId: ApartmentId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const options = getPostOptions({ apartmentId: apartmentId });
        fetch('/account/viewApartment', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                setMessage('');
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Unknown error while trying to view apartment');
                    return;
                }
                history.push('/mates');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleClickLeaveApartment = (apartmentId: ApartmentId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            userId: user._id,
            apartmentId: apartmentId,
        };
        const options = getPostOptions(data);
        fetch('/account/leaveApartment', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                } else if (!success) {
                    setMessage(
                        'Sorry, your request to leave the apartment could not be completed at this time.',
                    );
                } else {
                    const { user } = json;
                    setMessage('You have left the apartment.');
                    setUser({ ...user });
                }
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const content = apartmentSummaries.map((apartmentSummary) => (
        <ApartmentCell
            apartmentSummary={apartmentSummary}
            handleClickViewApartment={handleClickViewApartment}
            handleClickLeaveApartment={handleClickLeaveApartment}
            key={apartmentSummary.apartmentId}
        />
    ));

    if (redirect) {
        return <Redirect to="/" />;
    }
    return (
        <div className="apartments-cell-container">
            <div className="apartments-cell-header-container">
                <StandardStyledText
                    text={
                        apartmentSummaries.length === 0
                            ? 'Create or join an apartment to get started.'
                            : 'Apartments you are a member of.'
                    }
                />
                <div className="apartments-cell-message-container">
                    {!message ? null : <RedMessageCell message={message} />}
                </div>
            </div>
            <div className="apartments-cell-content-container">{content}</div>
        </div>
    );
};

export default ApartmentsCell;
