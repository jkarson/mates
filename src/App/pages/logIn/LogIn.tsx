import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RedMessageCell } from '../../common/components/ColoredMessageCells';
import PageCell from '../../common/components/PageCell';
import { BiggerSimpleButton } from '../../common/components/SimpleButtons';
import { StyledInput } from '../../common/components/StyledInputs';
import { getPostOptions } from '../../common/utilities';

import './LogIn.css';

const LogIn: React.FC<RouteComponentProps> = (props) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
        setError('');
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordInput(event.target.value);
        setError('');
    };

    const handleLogIn = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            username: usernameInput,
            password: passwordInput,
        };
        const options = getPostOptions(data);
        fetch('/login', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { success, message } = json;
                if (!success) {
                    setError(message);
                } else {
                    props.history.push('/account');
                }
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
        return;
    };

    const handleClickSignUp = () => {
        props.history.push('/signup');
    };

    const handleClickGoToDemo = () => {
        props.history.push('/demo');
    };

    return (
        <PageCell
            onHeaderClick={() => props.history.go(0)}
            content={
                <div className="login-content-container">
                    <div className="login-content-login-container">
                        <StyledInput
                            type="text"
                            value={usernameInput}
                            onChange={handleChangeUsername}
                            placeholder={'Username'}
                        />
                        <StyledInput
                            type="password"
                            value={passwordInput}
                            onChange={handleChangePassword}
                            placeholder={'Password'}
                        />
                        <div className="login-content-login-button-div">
                            <BiggerSimpleButton onClick={handleLogIn} text={'Log In'} />
                        </div>
                        <div className="login-content-login-error-div">
                            <ErrorMessage error={error} />
                        </div>
                    </div>
                    <div className="login-content-buttons-container">
                        <BiggerSimpleButton onClick={handleClickSignUp} text="Sign Up" />
                        <BiggerSimpleButton onClick={handleClickGoToDemo} text="Go To Demo" />
                    </div>
                </div>
            }
        />
    );
};

interface ErrorMessageProps {
    error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (error.length > 0) {
        return <RedMessageCell message={error} />;
    } else {
        return null;
    }
};

export default LogIn;
