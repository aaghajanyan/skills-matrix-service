
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { authService } from 'client/AuthService';
import { SMPage } from 'components/common/SMPage'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = authService.isLoggedIn();
    const redirection_url = rest.location.pathname + rest.location.search;

    return (
        <Route
            {...rest}
            render={props => {
                return isLoggedIn ? (
                    <SMPage content={<Component {...props} />} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { url: redirection_url },
                        }}
                    />
                );
            }}
        />
    );
};

export { PrivateRoute };