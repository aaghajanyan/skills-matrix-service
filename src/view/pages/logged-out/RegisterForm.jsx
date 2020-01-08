import React, { useState, useEffect } from 'react';
import { post, head } from 'client/lib/axiosWrapper';
import { messages } from 'constants';
import {
    nameValidator,
    passwordValidator,
    confirmPasswordValidator
} from 'helpers/validators';
import {
    SMForm,
    SMInput,
    SMSelect,
    SMButton,
    SMSpinner,
    SMDatePicker,
    SMNotification
} from 'view/components';

function RegisterForm(props) {

    const token = props.match.params.token;

    const [loadingButton, setLoadingButton] = useState(false);

    const [loading, setLoading] = useState(true);

    const [firstPassword, setSetFirstPassword] = useState(null);

    const onChange = (e) => {
        setSetFirstPassword(e.target.value);
    }

    const firstNameRule = { rules: [{ validator: nameValidator("first") }] };
    const lastNameRule = { rules: [{ validator: nameValidator("last") }] };
    const branchRule = { rules: [{ required: true, message: messages.validation.branch.required }] };
    const positionRule = { rules: [{ required: true, message: messages.validation.position.required }] };
    const passwordRule = { rules: [{ validator: passwordValidator }] };
    const confirmPasswordRule = { rules: [{ validator: confirmPasswordValidator(firstPassword) }] }
    const dateRule = { rules: [{ required: true, message: messages.validation.date.required }] }

    useEffect(() => {
        const options = {
            url: `invitations/${token}`,
        }
        head(options)
            .then(result => {
                setLoading(false)
            })
            .catch(error => {
                SMNotification('error', messages.invitations.nonexistentInvitation);
                props.history.push('/login')
            })
    })

    const handleSubmit = formData => {
        setLoadingButton(true);
        const data = {
            fname: formData.fname,
            lname: formData.lname,
            branchName: formData.branchName,
            position: formData.position,
            password: formData.password,
            startedToWorkDate: formData.startedToWorkDate.toString()
        }
        const options = {
            url: `users/${token}`,
            data: data
        }
        post(options)
            .then(result => {
                setLoadingButton(false);
                //TODO
            })
            .catch(error => {
                setLoadingButton(false);
                //TODO
            })
    }

    // TODO: Get from back end
    const positions = [
        { value: "SW Engineer" },
        { value: "Senior SW Engineer" },
        { value: "Beginner QA Tester" },
        { value: "QA Tester" },
        { value: "SQE Analyst" },
        { value: "Sr. Software Quality Engineer" },
        { value: "QA Analyst" },
        { value: "QA lead" },
        { value: "Team lead" },
        { value: "Graphic designer" },
        { value: "technical manager" },
        { value: "Senior Team lead" },
        { value: "Project Manager" },
        { value: "3D modeler" },
        { value: "UIUX designer" },
        { value: "SW Architect" }
    ]

    // TODO: Get from back end
    const branches = [
        { value: "Vanadzor" },
        { value: "Erevan" },
        { value: "Goris" }
    ]

    return (
        <SMSpinner isLoading={loading} className='sm-spin' size='large'>
            <SMForm
                className="sm-form register-form"
                items={[
                    SMInput({
                        className: 'sm-input',
                        name: 'fname',
                        type: 'text',
                        placeholder: 'First name',
                        rules: firstNameRule.rules,
                        autoComplete: 'off'
                    }),
                    SMInput({
                        className: 'sm-input',
                        name: 'lname',
                        type: 'text',
                        placeholder: 'Last name',
                        rules: lastNameRule.rules,
                        autoComplete: 'off'
                    }),
                    SMSelect({
                        className: 'sm-select',
                        name: 'branchName',
                        placeholder: "Branch",
                        options: branches,
                        rules: branchRule.rules
                    }),
                    SMSelect({
                        className: 'sm-select',
                        name: 'position',
                        placeholder: "Position",
                        options: positions,
                        rules: positionRule.rules
                    }),
                    SMInput({
                        className: 'sm-input',
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password',
                        rules: passwordRule.rules,
                        onChange: onChange,
                        autoComplete: 'off',
                    }),
                    SMInput({
                        className: 'sm-input',
                        name: 'repeat_password',
                        type: 'password',
                        placeholder: 'Repeat Password',
                        rules: confirmPasswordRule.rules,
                        autoComplete: 'off',
                    }),
                    SMDatePicker({
                        className: 'sm-date-picker',
                        name: 'startedToWorkDate',
                        placeholder: 'Start working date',
                        format: 'YYYY-MM-DD',
                        rules: dateRule.rules
                    })
                ]}
                buttons={[
                    SMButton({
                        className: 'sm-button',
                        name: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        children: 'Sing up',
                        loading: loadingButton,
                    }),
                ]}
                onSubmit={handleSubmit}
            />
        </SMSpinner>
    );
}

export { RegisterForm };
