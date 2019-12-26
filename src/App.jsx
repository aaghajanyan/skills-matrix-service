import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { Home } from 'pages/Home/Home';
import { SMPageLoggedOut } from 'pages/Common/SMPageLoggedOut'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from 'components/routers/PrivateRoute'
import { NotFound } from 'pages/NotFound/NotFound';
import { Employees } from 'pages/Employees/Employees';
import { FindEmployees } from 'components/pages/FindEmployees/FindEmployees';
import { Branches } from 'pages/Branches/Branches';
import { Categories } from 'pages/Categories/Categories';
import { Skills } from 'pages/Skills/Skills';
import { Settings } from 'pages/Settings/Settings';
import { SMEmployee } from 'components/common/SMEmployee/SMEmployee'
import './App.scss';
import store from 'config/store';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
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
            </Provider>
        );
    }
}

export { App };
