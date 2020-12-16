import React, { useEffect, useState } from 'react';
import PageCell from '../../common/components/PageCell';
import VerificationCell from '../../common/components/VerificationCell';
import { isLetter } from '../../common/utilities';

const SignUp: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
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
        //to do: implement
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
                </div>
            }
        />
    );
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
        //TO DO: Implement this!
        setShowMessage(true);
        setIsAvailable(true);
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
