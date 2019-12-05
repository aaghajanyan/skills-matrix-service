import React, { Component } from 'react';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login/Login';
import { Register } from './components/pages/Register/Register';
import { SMSiderMenu } from './components/common/SMSiderMenu';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './App.scss';

class App extends Component {

    render() {
        return (
            <Router>
                {/* TODO check logged in in status in store */}
                {/* {!this.state.loggedIn && <Redirect to="/login"  />} */}
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route exact path="/home" component={SMSiderMenu} />
            </Router>
        );
    }
}

export { App };
