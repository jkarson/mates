import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PageCell from '../../common/components/PageCell';

// to do: error cell can be extracted out too for maintainability

const LogIn: React.FC<RouteComponentProps> = (props) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
        setError('');
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordInput(event.target.value);
        setError('');
    };

    const handleLogIn = () => {
        const data = {
            username: usernameInput,
            password: passwordInput,
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        fetch('/login', options)
            .then((response) => response.json())
            .then((json) => {
                const { success, message } = json;
                if (!success) {
                    setError(message);
                } else {
                    props.history.push('/account');
                }
            })
            .catch((err) => console.error(err));
        return;
    };

    const handleClickSignUp = () => {
        props.history.push('/signup');
    };

    return (
        <PageCell
            content={
                <div>
                    <label>
                        {'Username: '}
                        <input type="text" value={usernameInput} onChange={handleChangeUsername} />
                    </label>
                    <br />
                    <label>
                        {'Password: '}
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={handleChangePassword}
                        />
                    </label>
                    <br />
                    <button onClick={handleLogIn}>{'Log In'}</button>
                    <br />
                    <ErrorMessage error={error} />
                    <br />
                    <br />
                    <br />
                    <button onClick={handleClickSignUp}>{'Or, Sign Up'}</button>
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

export default LogIn;
