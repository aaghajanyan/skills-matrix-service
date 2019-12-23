
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { authService } from 'client/lib/AuthService';
import { SMPageLoggedIn } from 'pages/logged-in'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = authService.isLoggedIn();
    const redirection_url = rest.location.pathname + rest.location.search;

    return (
        <Route
            {...rest}
            render={props => {
                return isLoggedIn ? (
                    <SMPageLoggedIn content={<Component {...props} />} />
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