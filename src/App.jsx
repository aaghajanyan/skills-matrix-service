import React, { Component } from 'react';
import { Home } from 'pages/Home/Home';
import { SMPageLoggedOut } from 'pages/Common/SMPageLoggedOut'
import { LoginForm } from 'pages/Login/LoginForm';
import { RegisterForm } from 'pages/Register/RegisterForm';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from 'components/routers/PrivateRoute'
import { NotFound } from 'pages/NotFound/NotFound';
import { Employees } from 'pages/Employees/Employees';
import { FindEmployees } from 'pages/FindEmployees/FindEmployees'
import { Branches } from 'pages/Branches/Branches';
import { Categories } from 'pages/Categories/Categories';
import { Skills } from 'pages/Skills/Skills';
import { Settings } from 'pages/Settings/Settings';
import './App.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={(props) => <SMPageLoggedOut> <LoginForm {...props} /> </SMPageLoggedOut>}  />
                    <Route path="/register/:token" component={(props) => <SMPageLoggedOut> <RegisterForm {...props}/> </SMPageLoggedOut>} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/home" component={Home} />
                    <PrivateRoute path="/employees" component={Employees} />
                    <PrivateRoute path="/find_employees" component={FindEmployees} />
                    <PrivateRoute path="/branches" component={Branches} />
                    <PrivateRoute path="/categories" component={Categories} />
                    <PrivateRoute path="/skills" component={Skills} />
                    <PrivateRoute path="/settings" component={Settings} />
                    <Route path="**" component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export { App };
