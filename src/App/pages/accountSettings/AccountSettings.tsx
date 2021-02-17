import React, { useLayoutEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import ApartmentLink from '../../common/components/ApartmentLink';
import { RedMessageCell } from '../../common/components/ColoredMessageCells';
import LoadingPageCell from '../../common/components/LoadingPageCell';
import PageCell from '../../common/components/PageCell';
import ProfileLink from '../../common/components/ProfileLink';
import ServerErrorPageCell from '../../common/components/ServerErrorPageCell';
import { BiggerSimpleButton, SimpleButton } from '../../common/components/SimpleButtons';
import StandardStyledText from '../../common/components/StandardStyledText';
import YesNoMessageModal from '../../common/components/YesNoMessageModal';
import { getDeleteOptions, getPostOptions } from '../../common/utilities';

import './AccountSettings.css';

const AccountSettings: React.FC<RouteComponentProps> = (props) => {
    const [redirect, setRedirect] = useState(false);
    const [username, setUsername] = useState<null | string>(null);
    const [userId, setUserId] = useState<null | string>(null);
    const [selectedApartmentName, setSelectedApartmentName] = useState<null | string>(null);
    const [showModal, setShowModal] = useState(false);
    const [footerMessage, setFooterMessage] = useState('');
    const [serverError, setServerError] = useState(false);
    const [serverCallMade, setServerCallMade] = useState(false);

    useLayoutEffect(() => {
        fetch('/account-settings')
            .then((response) => response.json())
            .then((json) => {
                setServerError(false);
                const { authenticated } = json;
                if (!authenticated) {
                    setRedirect(true);
                }
                const { username, userId, selectedApartmentName } = json;
                setUsername(username);
                setUserId(userId);
                setSelectedApartmentName(selectedApartmentName);
            })
            .catch(() => setServerError(true));
    }, []);

    const handleClickLogOut = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const options = getPostOptions({});
        fetch('/account-settings/logOutUser', options)
            .then((res) => res.json())
            .then(() => {
                setServerCallMade(false);
                setRedirect(true);
            })
            .catch(() => setFooterMessage('Sorry, our server seems to be down.'));
    };

    const deleteAccount = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = { userId: userId };
        const options = getDeleteOptions(data);
        fetch('/account-settings/deleteAccount', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { success } = json;
                if (!success) {
                    setFooterMessage('Your account could not be deleted at this time');
                } else {
                    setRedirect(true);
                }
            })
            .catch(() => setFooterMessage('Sorry, our server seems to be down.'));
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    if (!username || !userId) {
        if (!serverError) {
            return <LoadingPageCell />;
        } else {
            return <ServerErrorPageCell />;
        }
    }

    const messageToUser = 'Hello, ' + username + '. We hope you are enjoying Mates!';

    return (
        <PageCell
            onHeaderClick={() => props.history.push('/account')}
            content={
                <div className="account-settings-container">
                    <div className="account-settings-modal-container">
                        <YesNoMessageModal
                            show={showModal}
                            setShow={setShowModal}
                            message="Are you sure you want to delete your account? This action is permanent."
                            onClickYes={() => deleteAccount()}
                            yesText={'Delete Account'}
                        />
                    </div>
                    <ProfileLink accountName={username} onClick={() => props.history.go(0)} />
                    {selectedApartmentName ? (
                        <ApartmentLink
                            apartmentName={selectedApartmentName}
                            onClick={() => props.history.push('/mates')}
                        />
                    ) : null}
                    <div className="account-settings-header-message-container">
                        {<StandardStyledText text={messageToUser} />}
                    </div>
                    <div className="account-settings-logout-button-container">
                        <BiggerSimpleButton onClick={handleClickLogOut} text="Log Out" />
                    </div>
                    <div className="account-settings-delete-account-button-container">
                        <SimpleButton onClick={() => setShowModal(true)} text={'Delete Account'} />
                    </div>
                    <div className="account-settings-footer-message-container">
                        {footerMessage.length === 0 ? null : (
                            <RedMessageCell message={footerMessage} />
                        )}
                    </div>
                </div>
            }
            tabs={undefined}
        />
    );
};

export default AccountSettings;
