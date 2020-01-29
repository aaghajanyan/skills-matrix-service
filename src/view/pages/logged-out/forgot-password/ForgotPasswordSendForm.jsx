import React, {useState} from "react";
import {useNavigation, useValidator} from "src/hooks/common";
import {emailValidator} from "src/helpers/validators";
import {sendPasswordUpdatingLinkTo} from "src/services/authService";
import {SMConfig} from "src/config";
import {SMButton, SMForm, SMIcon, SMInput} from "src/view/components";
import {Alert} from "antd";
import {format} from "util"


export function ForgotPasswordSendForm() {

    const navigateTo = useNavigation();

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [isEmailValid, email , emailRule] = useValidator(emailValidator);

    const messages = SMConfig.messages;

    const onForgotPasswordFormSubmitted = () => {
        setLoading(true);
        sendPasswordUpdatingLinkTo(email)
            .then(() => {
                navigateTo(SMConfig.routes.login, {success: format(messages.forgotPassword.instructionsHasBeenSent, email)})
            }).catch( e => {
                setErrorMessage(getErrorMessage(e));
                setLoading(false);
            });
    };


    const getErrorMessage = (e) => {
        if(e.message.toString().includes("409")){
            return messages.forgotPassword.userNotFound;
        } else {
            return messages.unknownError;
        }
    };

    return  (<React.Fragment>
        {errorMessage && <Alert
            className="sm-alert"
            message={errorMessage}
            type="error"
            closable
            onClose={() => setErrorMessage(null)}
        />}
        {!errorMessage && <Alert
            className="sm-alert"
            message={messages.forgotPassword.pageDescription.title}
            description={messages.forgotPassword.pageDescription.message}
            closable
            type="info"
        />}
        <SMForm
            className="sm-form login-form"
            items={ [SMInput({
                    className: 'sm-input',
                    name: 'email',
                    type: 'email',
                    placeholder: 'Email',
                    prefix: (
                        <SMIcon
                            className='sm-icon-grey'
                            iconType='fas'
                            icon='envelope'
                        />
                    ),
                    autoComplete: 'email',
                    rules : emailRule
                })]
            }
            buttons={ [
                SMButton({
                    className: 'sm-link',
                    name: 'forgot-password',
                    type: 'link',
                    href: SMConfig.routes.login,
                    children: 'Login',
                }),
                SMButton({
                    className: 'sm-button forgot-password-button',
                    name: 'submit',
                    type: 'primary',
                    htmlType: 'submit',
                    children: 'Send',
                    loading: loading,
                    disabled: !isEmailValid
                })]
            }
            onSubmit={onForgotPasswordFormSubmitted}
        /> </React.Fragment>);
}

