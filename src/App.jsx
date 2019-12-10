import React, { Component } from 'react';
import { Home } from 'components/pages/Home';
import { Login } from 'components/pages/Login/Login';
import { Register } from 'components/pages/Register/Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/routers/PrivateRoute'
import { NotFound } from 'components/pages/NotFound';
import { Employees } from 'components/pages/Employees/Employees';
import { FindEmployees } from 'components/pages/FindEmployees/FindEmployees'
import { Branches } from 'components/pages/Branches/Branches';
import { Categories } from 'components/pages/Categories/Categories';
import { Skills } from 'components/pages/Skills/Skills';
import { Settings } from 'components/pages/Settings/Settings';
import './App.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/home" component={Home} />
                    <PrivateRoute path="/employees" component={Employees} />
                    <PrivateRoute path="/find_employees" component={FindEmployees} />
                    <PrivateRoute path="/branches" component={Branches} />
                    <PrivateRoute path="/categories" component={Categories} />
                    <PrivateRoute path="/skills" component={Skills} />
                    <PrivateRoute path="/settings" component={Settings} />
                    <Route path="/register" component={Register} />
                    <Route path="**" component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export { App };
