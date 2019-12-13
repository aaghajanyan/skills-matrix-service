import React, { useState } from 'react';
import { SMForm } from 'components/common/Forms/SMForm/SMForm';
import { SMInput } from 'components/common/Forms/SMInput/SMInput';
import { SMSelect } from 'components/common/SMSelect/SMSelect';
import { SMButton } from 'components/common/SMButton/SMButton';
import { SMDatePicker } from 'components/common/SMDatePicker/SMDatePicker'
import { passwordValidator, nameValidator } from 'helpers/FormValidators';
import { post } from 'client/lib/axiosWrapper';

function RegisterForm(props) {

    const positions = [
        {value: "SW Engineer"},
        {value: "Senior SW Engineer"},
        {value: "Beginner QA Tester"},
        {value: "QA Tester"},
        {value: "SQE Analyst"},
        {value: "Sr. Software Quality Engineer"},
        {value: "QA Analyst"},
        {value: "QA lead"},
        {value: "Team lead"},
        {value: "Graphic designer"},
        {value: "technical manager"},
        {value: "Senior Team lead"},
        {value: "Project Manager"},
        {value: "3D modeler"},
        {value: "UIUX designer"},
        {value: "SW Architect"}
    ]

    const branches =  [
        {value: "Vanadzor"},
        {value: "Erevan"},
        {value: "Goris"}
    ]

    const token = props.match.params.token;

    const [loading, setLoading] = useState(false);

    const firstNameRule = { rules: [{ validator: nameValidator("First") }] };
    const lastNameRule = { rules: [{ validator: nameValidator("Last") }] };
    const branchRule = { rules: [{ required: true, message: 'Branch is required field!' }] };
    const positionRule = { rules: [{ required: true, message: 'Position is required field!' }] };
    const passwordRule = { rules: [{ validator: passwordValidator }] };


    const handleSubmit = formData => {
        setLoading(true);
        const options = {
            url : `users/${token}`,
            data : formData
        }
        post(options)
            .then(result => {
                //TODO
            })
            .catch(error => {
                //TODO
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
            <React.Fragment>
                <SMForm
                    className="sm-form"
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
                            options:branches,
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
                            autoComplete: 'off',
                        }),
                        SMInput({
                            className: 'sm-input',
                            name: 'repeat_password',
                            type: 'password',
                            placeholder: 'Repeat Password',
                            rules: passwordRule.rules,
                            autoComplete: 'off',
                        }),
                        SMDatePicker({
                            className: 'sm-date-picker',
                            name: 'startedToWorkDate',
                            placeholder: 'Start working date',
                            dateFormat: 'YYYY/MM/DD'
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
