import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { RedMessageCell, GreenMessageCell } from '../../common/components/ColoredMessageCells';
import PageCell from '../../common/components/PageCell';
import { BiggerSimpleButton, SimpleButton } from '../../common/components/SimpleButtons';
import StandardStyledText from '../../common/components/StandardStyledText';
import { StyledInput } from '../../common/components/StyledInputs';
import VerificationCell from '../../common/components/VerificationCell';
import { getPostOptions, isLetter } from '../../common/utilities';

import './SignUp.css';

const SignUp: React.FC<RouteComponentProps> = (props) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState<string>('');
    const [serverCallMade, setServerCallMade] = useState(false);

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
        setError('');
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordInput(event.target.value);
        setError('');
    };

    const handleChangePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordInput(event.target.value);
        setError('');
    };

    const isValidPasswordInput = () => {
        const characters = [...passwordInput];
        return characters.length >= 6 && !characters.every((char) => isLetter(char));
    };

    const isValidConfirmPasswordInput = () => {
        return isValidPasswordInput() && confirmPasswordInput === passwordInput;
    };

    const canCreate = () => {
        return !serverCallMade && isValidConfirmPasswordInput() && usernameInput.length > 0;
    };

    const handleCreateAccount = () => {
        setServerCallMade(true);
        const data = {
            username: usernameInput,
            password: passwordInput,
        };
        const options = getPostOptions(data);
        fetch('/signup', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const created = json.created;
                if (created) {
                    setUsernameInput('');
                    setPasswordInput('');
                    setConfirmPasswordInput('');
                    setError('');
                    setRedirect(true);
                } else {
                    setError(json.message);
                }
            })
            .catch(() => {
                setError('Sorry, our server seems to be down.');
            });
        return;
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <PageCell
            onHeaderClick={() => props.history.goBack()}
            content={
                <div className="signup-container">
                    <StandardStyledText
                        text={
                            'Your username can be anything you like, as long as it is not already taken.'
                        }
                    />
                    <div>
                        <StandardStyledText text="Your password must contain" />
                        <StandardStyledText text="• at least 6 characters" />
                        <StandardStyledText text="• at least one number or special character" />
                    </div>
                    <div>
                        <StyledInput
                            type="text"
                            value={usernameInput}
                            onChange={handleChangeUsername}
                            placeholder={'Username'}
                        />
                    </div>
                    <div className="password-and-verification">
                        <StyledInput
                            type="password"
                            value={passwordInput}
                            onChange={handleChangePassword}
                            placeholder={'Password'}
                        />

                        <VerificationCell isVerified={isValidPasswordInput()} />
                    </div>
                    <AvailabilityCell usernameInput={usernameInput} />
                    <div className="password-and-verification">
                        <StyledInput
                            type="password"
                            value={confirmPasswordInput}
                            onChange={handleChangePasswordInput}
                            placeholder={'Confirm Password'}
                        />
                        <VerificationCell isVerified={isValidConfirmPasswordInput()} />
                    </div>
                    <div className="button-container">
                        <div className="create-button">
                            {canCreate() ? (
                                <BiggerSimpleButton
                                    onClick={handleCreateAccount}
                                    text="Create Account"
                                />
                            ) : (
                                <div className="create-account-faux-button-container">
                                    <BiggerSimpleButton
                                        onClick={() => null}
                                        text="Create Account"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="create-error">
                            <ErrorMessage error={error} />
                        </div>
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

interface AvailabilityCellProps {
    usernameInput: string;
}

const AvailabilityCell: React.FC<AvailabilityCellProps> = ({ usernameInput }) => {
    const showButton = usernameInput.length > 0;
    const [showMessage, setShowMessage] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [serverCallMade, setServerCallMade] = useState(false);

    useEffect(() => {
        setShowMessage(false);
        setIsAvailable(false);
    }, [usernameInput]);

    const checkAvailability = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            username: usernameInput,
        };
        const options = getPostOptions(data);
        fetch(
            'ec2-18-219-207-112.us-east-2.compute.amazonaws.com/signup/checkUsernameAvailability',
            options,
        )
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                setServerError(false);
                const { available } = json;
                if (available) {
                    setIsAvailable(true);
                    setShowMessage(true);
                } else {
                    setIsAvailable(false);
                    setShowMessage(true);
                }
            })
            .catch(() => setServerError(true));
    };

    return (
        <div className="availability-cell-container">
            {showButton ? (
                <div>
                    <div className="availability-cell-button-div">
                        <SimpleButton onClick={checkAvailability} text={'Check Availability'} />
                    </div>
                    <div className="availability-cell-message-div">
                        {showMessage ? (
                            isAvailable ? (
                                <GreenMessageCell message="This username is available" />
                            ) : (
                                <RedMessageCell message="Sorry, this username is taken" />
                            )
                        ) : serverError ? (
                            <RedMessageCell message="Sorry, our server seems to be down." />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default SignUp;
