import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {SMPageLoggedOut} from 'src/view/pages/logged-out';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {PrivateRoute} from 'src/view/routers/PrivateRoute';
import {NotFound} from 'src/view/pages/not-found/NotFound';
import {
    Branches,
    Categories,
    Employees,
    Search,
    Home,
    Settings,
    Skills
} from 'src/view/pages/logged-in/sub-pages';
import {SMEmployee} from 'src/view/pages/logged-in/components';


import {ErrorBoundary} from 'src/view/components/ErrorBoundary';

import store from 'src/store';

import './App.scss';
import {SMConfig} from './config';


class App extends Component {
    routes = SMConfig.routes;
    render() {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <Router>
                        <Switch>
                            <Route path={
                                [
                                    this.routes.login,
                                    this.routes.forgotPassword,
                                    this.routes.forgotPassword,
                                    this.routes.registration
                                ]}
                                component={SMPageLoggedOut}
                            />
                            <PrivateRoute exact path={this.routes.home} component={Home} />
                            <PrivateRoute exact path={this.routes.employees} component={Employees} />
                            <PrivateRoute exact path={`${this.routes.employees}/:id`} component={SMEmployee} />
                            <PrivateRoute path={this.routes.findEmployees} component={Search} />
                            <PrivateRoute exact path={this.routes.branches} component={Branches} />
                            <PrivateRoute exact path={this.routes.categories} component={Categories} />
                            <PrivateRoute exact path={this.routes.skills} component={Skills} />
                            <PrivateRoute exact path={this.routes.settings} component={Settings} />
                            <Route path="**" component={NotFound} />
                        </Switch>
                    </Router>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export {App};
