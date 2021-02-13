import React, { useContext, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import RedMessageCell from '../../../common/components/RedMessageCell';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { AccountContext, AccountContextType } from '../../../common/context';
import { ApartmentId } from '../../../common/models';
import { getPostOptions } from '../../../common/utilities';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';

import '../styles/ApartmentsCell.css';
import ApartmentCell from './ApartmentCell';

//TO DO: Use word-wrap / overflow-wrap to protect
//against long names sending the buttons out of alignment

const ApartmentsCell: React.FC<RouteComponentProps> = ({ history }) => {
    const userContext = useContext(AccountContext) as AccountContextType;

    const { user, setUser } = userContext;
    const apartmentSummaries: ApartmentSummary[] = user.apartments;
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');

    const handleClickViewApartment = (apartmentId: ApartmentId) => {
        setMessage('');
        const options = getPostOptions({ apartmentId: apartmentId });
        fetch('/account/viewApartment', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Unknown Error while trying to view apartment');
                    return;
                }
                console.log(json);
                history.push('/mates');
            })
            .catch((err) => console.error(err));
    };

    const handleClickLeaveApartment = (apartmentId: ApartmentId) => {
        const data = {
            userId: user._id,
            apartmentId: apartmentId,
        };
        const options = getPostOptions(data);
        fetch('/account/leaveApartment', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                } else if (!success) {
                    setMessage(
                        'Sorry, your request to leave the apartment could not be completed at this time',
                    );
                } else {
                    const { user } = json;
                    setMessage('You have left the apartment.');
                    setUser({ ...user });
                }
            });
    };

    const content = apartmentSummaries.map((apartmentSummary) => (
        <ApartmentCell
            apartmentSummary={apartmentSummary}
            handleClickViewApartment={handleClickViewApartment}
            handleClickLeaveApartment={handleClickLeaveApartment}
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
