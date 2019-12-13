import React, { Component } from 'react';
import { Home } from 'components/pages/Home';
import { Login } from 'components/pages/Login/Login';
import { Register } from 'components/pages/Register/Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/routers/PrivateRoute'
import { NotFound } from 'components/pages/NotFound';
// import { Employess } from 'components/common/Employess/Employess';
// import { PeopleFinder } from 'components/common/PeopleFinder/PeopleFinder';

import './App.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/home" component={Home} />
                    {/* <PrivateRoute path="/employess" component={Employess} /> */}
                    {/* <PrivateRoute path="/people_finder" component={PeopleFinder} /> */}
                    <Route path="/register" component={Register} />
                    <Route path="**" component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export { App };
