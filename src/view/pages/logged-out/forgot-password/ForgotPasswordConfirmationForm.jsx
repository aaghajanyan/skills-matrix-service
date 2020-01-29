import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom"

import {useNavigation, useValidator} from "src/hooks/common";
import {changePassword, checkResetPasswordToken} from "src/services/authService";
import {SMConfig} from "src/config";
import {SMButton, SMForm, SMIcon, SMInput} from "src/view/components";
import {passwordValidator} from "src/helpers/validators";
import {Alert} from "antd";


export function ForgotPasswordConfirmation(){

    const match = useRouteMatch();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isPasswordValid, password, passwordRule] = useValidator(passwordValidator);
    const [isConfirmPasswordValid, confirmPassword, confirmPasswordRule] = useValidator(passwordValidator);

    const navigateTo = useNavigation();

    const messages = SMConfig.messages;

    useEffect(()=> {
        checkResetPasswordToken(match.params.token)
            .catch(() => {
                navigateTo(SMConfig.routes.login, {error : messages.invalidToken} )
            })
    });

    const onForgotPasswordFormSubmitted = () => {
        if(password !== confirmPassword){
            setErrorMessage(messages.validation.password.passwordsDoNotMatch);
        } else {
            setLoading(true);
            changePassword(match.params.token, password)
                .then(() => {
                    navigateTo(SMConfig.routes.login, {success: messages.forgotPassword.passwordHasBeenChangedSuccessfully})
                })
                .catch(() => {
                    navigateTo(SMConfig.routes.login, {error: messages.forgotPassword.passwordHasNotBeenChanged})
                })
        }

    };
    return  (<React.Fragment>
        {errorMessage && (
            <Alert
                className="sm-alert"
                message={errorMessage}
                type="error"
                closable
            />
        )}
        <SMForm
            className="sm-form login-form"
            items={[
                    SMInput({
                        className: 'sm-input',
                        name: 'confirm password',
                        type: 'password',
                        placeholder: 'New password',
                        prefix: (<SMIcon
                            className='sm-icon-grey'
                            iconType='fas'
                            icon='lock'
                        />),
                        rules: passwordRule
                    }),
                    SMInput({
                        className: 'sm-input',
                        name: 'password',
                        type: 'password',
                        placeholder: 'Confirm password',
                        prefix: (<SMIcon
                            className='sm-icon-grey'
                            iconType='fas'
                            icon='lock'
                        />),
                        rules: confirmPasswordRule
                    })
                ]
            }
            buttons={[ SMButton({
                    className: 'sm-button forgot-password-button',
                    name: 'submit',
                    type: 'primary',
                    htmlType: 'submit',
                    children: 'Reset',
                    loading: loading,
                    disabled: !(isPasswordValid && isConfirmPasswordValid) || (password !== confirmPassword)
                })]
            }
            onSubmit={onForgotPasswordFormSubmitted}
        /> </React.Fragment>);
}