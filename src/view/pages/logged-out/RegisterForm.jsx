import React, {useState} from 'react';
import {nameValidator, passwordValidator, requiredValidator} from 'src/helpers/validators';
import {SMButton, SMDatePicker, SMForm, SMInput, SMSelect, SMSpinner} from 'src/view/components';
import {SMConfig} from 'src/config';
import {checkInvitation} from 'src/services/invitationsService';
import {registerUser} from 'src/services/authService';
import {useNavigation, useService, useValidator} from '../../../hooks/common';

function RegisterForm(props) {

    const token = props.match.params.token;

    const [isPending, setIsPending] = useState(false);

    const [isFirstNameValid, , firstNameRule] = useValidator(nameValidator('First'));
    const [isLastNameValid, , lastNameRule] = useValidator(nameValidator('Last'));
    const [isBranchValid, , branchRule] = useValidator(nameValidator('Branch'));
    const [isPositionValid, , positionRule] = useValidator(requiredValidator('Position'));
    const [isPasswordValid, passwordValue, passwordRule] = useValidator(passwordValidator);
    const [isConfirmPassword, confirmPasswordValue, confirmPasswordRule] = useValidator(passwordValidator);
    const [isDateValid, , dateRule] = useValidator(requiredValidator('Date'));

    const isEntireFormValid = [isFirstNameValid,
        isLastNameValid,
        isBranchValid,
        isPositionValid,
        isPasswordValid,
        isConfirmPassword,
        isDateValid
    ].every(e => e) && passwordValue === confirmPasswordValue;

    const navigateTo = useNavigation();

    const [isCompleted, , error] = useService(checkInvitation, token);

    if(error){
        navigateTo(SMConfig.routes.login, {
            error: SMConfig.messages.invitations.nonexistentInvitation.message
        });
    }

    const handleSubmit = data => {
        setIsPending(true);
        registerUser(token, data)
            .then(() => {
                navigateTo(SMConfig.routes.login, {
                    success: 'User has been added'
                });
            })
            .catch(() => {
                setIsPending(false);
            });
    };


    // TODO: Fetch from back end
    const positions = [
        {value: 'SW Engineer'},
        {value: 'Senior SW Engineer'},
        {value: 'Beginner QA Tester'},
        {value: 'QA Tester'},
        {value: 'SQE Analyst'},
        {value: 'Sr. Software Quality Engineer'},
        {value: 'QA Analyst'},
        {value: 'QA lead'},
        {value: 'Team lead'},
        {value: 'Graphic designer'},
        {value: 'technical manager'},
        {value: 'Senior Team lead'},
        {value: 'Project Manager'},
        {value: '3D modeler'},
        {value: 'UIUX designer'},
        {value: 'SW Architect'}
    ];

    // TODO: Get from back end
    const branches = [
        {value: 'Vanadzor'},
        {value: 'Erevan'},
        {value: 'Goris'}
    ];

    return (
        <SMSpinner isLoading={!isCompleted} className="sm-spin" size="large">
            <SMForm
                className="sm-form register-form"
                items={[
                    SMInput({
                        className: 'sm-input sm-input-register',
                        name: 'fname',
                        type: 'text',
                        placeholder: 'First name',
                        rules: firstNameRule,
                        autoComplete: 'off'
                    }),
                    SMInput({
                        className: 'sm-input sm-input-register',
                        name: 'lname',
                        type: 'text',
                        placeholder: 'Last name',
                        rules: lastNameRule,
                        autoComplete: 'off'
                    }),
                    SMSelect({
                        className: 'sm-select',
                        name: 'branchName',
                        placeholder: 'Branch',
                        options: branches,
                        rules: branchRule,
                    }),
                    SMSelect({
                        className: 'sm-select',
                        name: 'position',
                        placeholder: 'Position',
                        options: positions,
                        rules: positionRule,
                    }),
                    SMInput({
                        className: 'sm-input sm-input-register',
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password',
                        rules: passwordRule,
                        autoComplete: 'off'
                    }),
                    SMInput({
                        className: 'sm-input sm-input-register',
                        name: 'repeat_password',
                        type: 'password',
                        placeholder: 'Repeat Password',
                        rules: confirmPasswordRule,
                        autoComplete: 'off'
                    }),
                    SMDatePicker({
                        className: 'sm-date-picker',
                        name: 'startedToWorkDate',
                        placeholder: 'Start working date',
                        format: 'YYYY-MM-DD',
                        rules: dateRule
                    })
                ]}
                buttons={[
                    SMButton({
                        className: 'sm-button',
                        name: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        children: 'Sing up',
                        loading: isPending,
                        disabled: !isEntireFormValid
                    })
                ]}
                onSubmit={handleSubmit}
            />
        </SMSpinner>
    );
}

export {RegisterForm};
