
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isLoggedIn } from 'client/lib/authService';
import { SMPageLoggedIn } from 'pages/logged-in'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const loggedIn = isLoggedIn();
    const redirection_url = rest.location.pathname + rest.location.search;

    return (
        <Route
            {...rest}
            render={props => {
                return loggedIn ? (
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