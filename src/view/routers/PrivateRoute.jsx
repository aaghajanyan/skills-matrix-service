
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import cookie from 'react-cookies'
import { SMSpinner } from 'view/components'
import { get } from 'client/lib/axiosWrapper';
import { authTokenKey } from 'constants'
import { SMPageLoggedIn } from 'pages/logged-in'
import { setCurrentUser } from 'store/actions/currentUserAction';

//TODO: Remove
function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (ignored) {
        return { guid: null }
    }
};

const PrivateRoute = ({ component: Component, ...rest }) => {

    const redirection_url = rest.location.pathname + rest.location.search;

    const currentUser = useSelector(state => state.CurrentUser)

    const dispatch = useDispatch();

    const history = useHistory();

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const gotToLogin = () => {
            history.push({
                pathname: '/login',
                state: { url: redirection_url },
            });
        }

        if (!currentUser) {
            const token = cookie.load(authTokenKey);
            const guid = token ? parseJwt(token).guid : null
            if (guid) {
                get({ url: `users/${guid}` })
                    .then((result) => {
                        setLoading(false)
                        dispatch(setCurrentUser(result.data));
                    })
                    .catch((error) => {
                        gotToLogin();
                    })
            } else {
                gotToLogin();
            }
        } else {
            setLoading(false)
        }
    // eslint-disable-next-line
    }, [])

    return (
        <SMSpinner size='large' isLoading={loading}>
            <Route
                {...rest}
                render={props => {
                    return <SMPageLoggedIn content={<Component {...props} />} />
                }}
            />
        </SMSpinner>
    );
};

export { PrivateRoute };