import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Account from './pages/account/Account';
import AccountSettings from './pages/accountSettings/AccountSettings';
import Demo from './pages/demo/Demo';
import LogIn from './pages/logIn/LogIn';
import Mates from './pages/mates/Mates';
import SignUp from './pages/signUp/SignUp';

//to do: push onto stack when you go to demo, dont just redirect
//back button in sign-up needed

class App extends Component {
    render() {
        const App = () => (
            <div>
                <Switch>
                    <Route exact path="/" render={(props) => <LogIn {...props} />} />
                    <Route exact path="/signup" render={(props) => <SignUp {...props} />} />
                    <Route exact path="/mates" render={(props) => <Mates {...props} />} />
                    <Route exact path="/account" render={(props) => <Account {...props} />} />
                    <Route exact path="/demo" component={Demo} />
                    <Route
                        exact
                        path="/account-settings"
                        render={(props) => <AccountSettings {...props} />}
                    />
                </Switch>
            </div>
        );
        return <App />;
    }
}

export default App;
