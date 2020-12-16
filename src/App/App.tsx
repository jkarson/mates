import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Account from './pages/account/Account';
//import './App.css';
import LogIn from './pages/logIn/LogIn';
import Mates from './pages/mates/Mates';
import SignUp from './pages/signUp/SignUp';

class App extends Component {
    render() {
        const App = () => (
            <div>
                <Switch>
                    <Route exact path="/" render={(props) => <LogIn {...props} />} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/mates" component={Mates} />
                    <Route exact path="/account" component={Account} />
                </Switch>
            </div>
        );
        return (
            <Switch>
                <App />
            </Switch>
        );
    }
}

export default App;
