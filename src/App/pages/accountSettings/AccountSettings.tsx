import React, { useLayoutEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import ApartmentLink from '../../common/components/ApartmentLink';
import BiggerSimpleButton from '../../common/components/BiggerSimpleButton';
import PageCell from '../../common/components/PageCell';
import ProfileLink from '../../common/components/ProfileLink';
import RedMessageCell from '../../common/components/RedMessageCell';
import SimpleButton from '../../common/components/SimpleButton';
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

    useLayoutEffect(() => {
        fetch('/account-settings')
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                const { authenticated } = json;
                if (!authenticated) {
                    setRedirect(true);
                }
                const { username, userId, selectedApartmentName } = json;
                setUsername(username);
                setUserId(userId);
                setSelectedApartmentName(selectedApartmentName);
            })
            .catch((err) => console.error(err));
    }, []);

    //to do: technically api should be called on account-settings route but idt it matters for the moment
    const handleClickLogOut = () => {
        const options = getPostOptions({});
        fetch('/account/logOutUser', options).then(() => setRedirect(true));
    };

    const deleteAccount = () => {
        const data = { userId: userId };
        const options = getDeleteOptions(data);
        fetch('/account-settings/deleteAccount', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const { success } = json;
                if (!success) {
                    setFooterMessage('Your account could not be deleted at this time');
                } else {
                    setRedirect(true);
                }
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    if (!username || !userId) {
        return null;
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
