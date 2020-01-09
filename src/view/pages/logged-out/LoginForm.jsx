import React, { useState } from 'react';
import { Alert } from 'antd';
import { SMForm, SMInput, SMButton, SMIcon } from 'view/components';
import { Redirect } from 'react-router-dom';
import { login } from 'client/lib/authService';
import { messages } from 'constants'

import { setCurrentUser } from '../../../actions/currentUserAction';
import { useDispatch } from 'react-redux';

function LoginForm(props) {

    const dispatch = useDispatch();

    const [errorMessage, setErrorMessage] = useState(null);

    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(false);

    const showError = err => {
        setErrorMessage(err);
    };

    const onAlertClose = () => {
        setErrorMessage(null);
    };

    const handleSubmit = formData => {
        setLoading(true);
        login(formData)
            .then((user) => {
                setLoading(false);
                onAlertClose(null);
                setSuccess(true);
                dispatch(setCurrentUser(user));
            })
            .catch(error => {
                setLoading(false);
                showError(error)
            })
    }

    return success ? (
        <Redirect to={props.location.state ? props.location.state.url : '/'} />
    ) : (
            <React.Fragment>
                {errorMessage && (
                    <Alert
                        className="sm-alert"
                        message={messages.singIn.error}
                        type="error"
                        closable
                        afterClose={onAlertClose}
                    />
                )}
                <SMForm
                    className="sm-form login-form"
                    items={[
                        SMInput({
                            className: 'sm-input',
                            name: 'email',
                            type: 'text',
                            placeholder: 'Email',
                            prefix: (
                                <SMIcon
                                    className='sm-icon-grey'
                                    iconType='fas'
                                    icon='envelope'
                                />
                            ),
                            autoComplete: 'username',
                        }),
                        SMInput({
                            className: 'sm-input',
                            name: 'password',
                            type: 'password',
                            placeholder: 'Password',
                            prefix: (
                                <SMIcon
                                    className='sm-icon-grey'
                                    iconType='fas'
                                    icon='lock'
                                />
                            ),
                            autoComplete: 'new-password',
                        }),
                    ]}
                    buttons={[
                        SMButton({
                            className: 'sm-link',
                            name: 'forgot-password',
                            type: 'link',
                            href: '#',
                            children: 'Forgot Password?',
                        }),
                        SMButton({
                            className: 'sm-button',
                            name: 'submit',
                            type: 'primary',
                            htmlType: 'submit',
                            children: 'Sing in',
                            loading: loading,
                        })
                    ]}
                    onSubmit={handleSubmit}
                />
            </React.Fragment>
        );
}

export { LoginForm };
