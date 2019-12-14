import React, { useState } from 'react';
import cookie from 'react-cookies';
import { Alert } from 'antd';
import { SMForm } from 'components/common/Forms/SMForm/SMForm';
import { SMInput } from 'components/common/Forms/SMInput/SMInput';
import { SMButton } from 'components/common/SMButton/SMButton';
import { emailValidator, passwordValidator } from 'helpers/FormValidators';
import { Redirect } from 'react-router-dom';
import login_email_icon from 'assets/images/login_email_icon.svg';
import login_password_icon from 'assets/images/login_password_icon.svg';
const axios = require('client/lib/axiosWrapper');

function LoginForm(props) {

    const passwordRules = { rules: [{ validator: passwordValidator }] };

    const emailRules = { rules: [{ validator: emailValidator }] };

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
        const options = {
          url : "users/login",
          data : formData
        }
        axios.post(options)
            .then(result => {
                onAlertClose(null);
                setLoading(false);

                cookie.save('auth_token', result.data.token, {
                    path: '/',
                    maxAge: 86400,
                });
                setSuccess(true);
            })
            .catch(error => {
                setLoading(false);

                if (error.response) {
                    showError(error.response.data.message);
                } else if (error.request) {
                    //TODO handle error
                    console.log(error.request);
                } else {
                    //TODO handle error
                }
            });
    };

    return success ? (
        <Redirect to={props.location.state ? props.location.state.url : '/'} />
    ) : (
        <React.Fragment>
            {errorMessage && (
                <Alert
                    className="sm-alert-error"
                    message={errorMessage}
                    type="error"
                    closable
                    afterClose={onAlertClose}
                />
            )}
            <SMForm
                className="sm-form"
                items={[
                    SMInput({
                        className: 'sm-input',
                        name: 'email',
                        type: 'text',
                        placeholder: 'Email',
                        rules: emailRules.rules,
                        prefix: (
                            <img
                                className="sm-form-icon"
                                src={login_email_icon}
                                alt="email"
                            />
                        ),
                        autoComplete: 'username',
                    }),
                    SMInput({
                        className: 'sm-input',
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password',
                        rules: passwordRules.rules,
                        prefix: (
                            <img
                                className="sm-form-icon"
                                src={login_password_icon}
                                alt="password"
                            />
                        ),
                        autoComplete: 'new-password',
                    }),
                ]}
                buttons={[
                    SMButton({
                        className: 'login-forgot-password-btn',
                        name: 'forgot-password',
                        type: 'link',
                        href: '#',
                        children: 'Forgot Password?',
                    }),
                    SMButton({
                        className: 'login-submit-btn',
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
