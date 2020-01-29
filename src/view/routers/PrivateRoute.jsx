import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Route, useHistory} from 'react-router-dom';
import cookie from 'react-cookies'
import {SMSpinner} from 'src/view/components'
import {SMPageLoggedIn} from 'src/view/pages/logged-in'
import {setCurrentUser} from 'src/store/actions/userActions';
import {getCurrentUser} from "src/services/usersService";
import {AUTH_TOKEN} from "../../services/authService";


const PrivateRoute = ({ component: Component, ...rest }) => {

    const redirection_url = rest.location.pathname + rest.location.search;

    const currentUser = useSelector(state => state.user);

    const dispatch = useDispatch();

    const history = useHistory();

    const [loading, setLoading] = useState(currentUser === null);

    useEffect(() => {
        const navigateToLogin = () => {
            history.push({
                pathname: '/login',
                state: { url: redirection_url },
            });
        };

        if (!currentUser) {
            const token = cookie.load(AUTH_TOKEN);
            if (token) {
                getCurrentUser()
                    .then((currentLoggedInUser) => {
                        setLoading(false);
                        dispatch(setCurrentUser(currentLoggedInUser));
                    })
                    .catch((error) => {
                        if(error.message === "Network Error"){
                            setLoading(false)
                            SMNotification('error', messages.noConnection);
                        }
                    })
            } else {
                navigateToLogin();
            }
        } else {
            setLoading(false)
        }

    }, [currentUser, dispatch, history, redirection_url]);

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