import React, { useState } from 'react';
import { SMForm } from 'components/common/Forms/SMForm/SMForm';
import { SMInput } from 'components/common/Forms/SMInput/SMInput';
import { SMSelect } from 'components/common/SMSelect/SMSelect';
import { SMButton } from 'components/common/SMButton/SMButton';
import { passwordValidator, nameValidator } from 'helpers/FormValidators';

function RegisterForm() {

    const [loading, setLoading] = useState(false);

    const nameRules = { rules: [{ validator: nameValidator }] };
    const branchRules = { rules: [{ required: true, message: 'Please select your country!' }] };
    const passwordRules = { rules: [{ validator: passwordValidator }] };


    const handleSubmit = formData => {
        //TODO
    }

    return (
            <React.Fragment>
                <SMForm
                    className="register-form"
                    items={[
                        SMInput({
                            className: 'sm-input',
                            name: 'fname',
                            type: 'text',
                            placeholder: 'First name',
                            autoComplete: 'username',
                            rules: nameRules.rules,
                        }),
                        SMInput({
                            className: 'sm-input',
                            name: 'lname',
                            type: 'text',
                            placeholder: 'Last name',
                            autoComplete: 'username',
                            rules: nameRules.rules,
                        }),
                        SMSelect({
                            className: 'sm-select',
                            name: 'select',
                            placeholder: "Please select a branch",
                            options: [
                                {value: "Vanadzor"},
                                {value: "Erevan"},
                                {value: "Goris"}
                            ],
                            rules: branchRules.rules
                        }),
                        SMInput({
                            className: 'sm-input',
                            name: 'password',
                            type: 'password',
                            placeholder: 'Password',
                            rules: passwordRules.rules,
                            autoComplete: 'new-password',
                        }),
                        SMInput({
                            className: 'sm-input',
                            name: 'repeat_password',
                            type: 'password',
                            placeholder: 'Repeat Password',
                            rules: passwordRules.rules,
                            autoComplete: 'new-password',
                        }),
                        SMButton({
                            className: 'login-submit-btn',
                            name: 'submit',
                            type: 'primary',
                            htmlType: 'submit',
                            children: 'Sing up',
                            loading: loading,
                        }),
                    ]}
                    onSubmit={handleSubmit}
                />
            </React.Fragment>
        );
}

export { RegisterForm };
