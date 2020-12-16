import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PageCell from '../../common/components/PageCell';

const LogIn: React.FC<RouteComponentProps> = (props) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInput(event.target.value);
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordInput(event.target.value);
    };

    const handleLogIn = () => {
        //to do: implement
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
                    <br />
                    <button onClick={handleClickSignUp}>{'Or, Sign Up'}</button>
                </div>
            }
        />
    );
};

export default LogIn;
