import React, { Component } from 'react';
import { SMPageLoggedOut } from 'pages/logged-out'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from 'components/routers/PrivateRoute'
import { NotFound } from 'pages/NotFound/NotFound';
import { Home } from 'pages/logged-in/sub-pages';
import { Employees } from 'pages/logged-in/sub-pages';
import { Branches } from 'pages/logged-in/sub-pages';
import { Categories } from 'pages/logged-in/sub-pages';
import { Skills } from 'pages/logged-in/sub-pages';
import { Settings } from 'pages/logged-in/sub-pages';
import { SMEmployee } from 'pages/logged-in/components'
import { FindEmployees } from 'components/pages/FindEmployees/FindEmployees';
import './App.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={(props) => <SMPageLoggedOut {...props} />} />
                    <Route path="/registration/:token" component={(props) => <SMPageLoggedOut {...props} />} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/home" component={Home} />
                    <PrivateRoute exact path="/employees" component={Employees} />
                    <PrivateRoute exact path="/employees/:id" component={SMEmployee} />
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
