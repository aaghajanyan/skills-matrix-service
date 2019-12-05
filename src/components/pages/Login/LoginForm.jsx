import React, {useState} from 'react';
import cookie from 'react-cookies'
import { Alert } from 'antd';
import { SMForm } from '../../common/Forms/SMForm/SMForm';
import { SMInput } from '../../common/Forms/SMInput/SMInput';
import { SMButton } from '../../common/Forms/SMButton/SMButton';
import { emailValidator, passwordValidator } from '../../../helpers/FormValidators';
import { APIClient } from '../../../client/APIClient';
import { Redirect } from 'react-router-dom';

function LoginForm(props) {

    const passwordRules = { rules: [{ validator: passwordValidator }] }
    const emailRules = { rules: [{ validator: emailValidator }] }

    const [errorMessage, setErrorMessage] = useState(null)

    const [success, setSuccess] = useState(false)

    const showError = err => {
        setErrorMessage(err)
    }

    const onAlertClose = () => {
        setErrorMessage(null)
    }

    const handleSubmit = (formData) => {
        APIClient.login(formData)
        .then(result => {
            onAlertClose(null)
            cookie.save('auth_token', result.data.token, { maxAge: 86400, })
            setSuccess(true)
        }).catch((e) => {
            if (e.response.data.success === false) {
                showError(e.response.data.message)
            }
        })
    };

    return (
        !success ? (<React.Fragment>
            { errorMessage && <Alert message={errorMessage} type="error" closable afterClose={onAlertClose} /> }
            <SMForm className="login-form"
                items={[
                    SMInput({
                        name: 'email',
                        type: 'text',
                        placeholder: 'Email',
                        rules: emailRules.rules,
                        autoComplete: 'username',
                    }),
                    SMInput({
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password',
                        rules: passwordRules.rules,
                        autoComplete: 'new-password',
                    }),
                    SMButton({
                        className: 'forgot-password-btn',
                        name: 'forgot-password',
                        type: 'link',
                        href: "#",
                        children: 'Forgot Password?',
                    }),
                    SMButton({
                        className: 'submit-btn',
                        name: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        children: 'Sing in',
                    }),
                ]}
                onSubmit={handleSubmit}
            />
        </React.Fragment>) : <Redirect to="/"/>
    );
}

export { LoginForm };
