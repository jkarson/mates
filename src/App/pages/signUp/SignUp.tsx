import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PageCell from '../../common/components/PageCell';
import VerificationCell from '../../common/components/VerificationCell';
import { getPostOptions, isLetter } from '../../common/utilities';

// to do: we should switch from rendering client side
// to server side eventually, but since it requires fully
// built react pages, let's render react-side for development

const SignUp: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState<string>('');

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
        setError('');
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordInput(event.target.value);
    };

    const handleChangePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordInput(event.target.value);
    };

    const isValidPasswordInput = () => {
        const characters = [...passwordInput];
        return characters.length >= 6 && !characters.every((char) => isLetter(char));
    };

    const isValidConfirmPasswordInput = () => {
        return isValidPasswordInput() && confirmPasswordInput === passwordInput;
    };

    const canCreate = () => {
        return isValidConfirmPasswordInput() && usernameInput.length > 0;
    };

    const handleCreateAccount = () => {
        const data = {
            username: usernameInput,
            password: passwordInput,
        };
        const options = getPostOptions(data);
        fetch('/signup', options)
            .then((response) => response.json())
            .then((json) => {
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
            .catch((error) => {
                console.error('Error:', error);
            });
        return;
    };

    return (
        <PageCell
            content={
                <div>
                    <p>
                        {
                            'Your username can be anything you like, as long as it is not already taken.'
                        }
                    </p>
                    <label>
                        {'Username: '}
                        <input type="text" value={usernameInput} onChange={handleChangeUsername} />
                    </label>
                    <AvailabilityCell usernameInput={usernameInput} />
                    <br />
                    <p>
                        <span>{'Your password must contain'}</span>
                        <br />
                        <span>{'* at least 6 characters '}</span>
                        <br />
                        <span>{'* at least one number or special character'}</span>
                    </p>
                    <label>
                        {'Password: '}
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={handleChangePassword}
                        />
                    </label>
                    <VerificationCell isVerified={isValidPasswordInput()} />
                    <br />
                    <label>
                        {'Confirm Password: '}
                        <input
                            type="password"
                            value={confirmPasswordInput}
                            onChange={handleChangePasswordInput}
                        />
                    </label>
                    <VerificationCell isVerified={isValidConfirmPasswordInput()} />
                    {canCreate() ? (
                        <button onClick={handleCreateAccount}>{'Create Account'}</button>
                    ) : null}
                    <ErrorMessage error={error} />
                    {!redirect ? null : <Redirect to="/" />}
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
        return <p style={{ color: 'red' }}>{error}</p>;
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

    useEffect(() => {
        setShowMessage(false);
        setIsAvailable(false);
    }, [usernameInput]);

    const checkAvailability = () => {
        const data = {
            username: usernameInput,
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        fetch('/signup/checkUsernameAvailability', options)
            .then((response) => response.json())
            .then((json) => {
                const { available } = json;
                if (available) {
                    setIsAvailable(true);
                    setShowMessage(true);
                } else {
                    setIsAvailable(false);
                    setShowMessage(true);
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            {showButton ? (
                <div>
                    <button onClick={checkAvailability}>{'Check Availability'}</button>
                    {showMessage ? (
                        isAvailable ? (
                            <p style={{ color: 'green' }}>{'This username is available.'}</p>
                        ) : (
                            <p style={{ color: 'red' }}>{'Sorry, this username is taken.'}</p>
                        )
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default SignUp;
