import React, {useState, useEffect} from 'react';
import {nameValidator, passwordValidator, requiredValidator} from 'src/helpers/validators';
import {SMButton, SMDatePicker, SMForm, SMInput, SMSelect, SMSpinner} from 'src/view/components';
import {SMConfig} from 'src/config';
import {checkInvitation} from 'src/services/invitationsService';
import {registerUser} from 'src/services/authService';
import {useNavigation, useService, useValidator} from '../../../hooks/common';
import {getBranches} from 'src/services/branchService';
import {getPositions} from 'src/services/positionService';
import moment from 'moment';

function RegisterForm(props) {

    const token = props.match.params.token;

    const [isPending, setIsPending] = useState(false);
    const [branches, setBranches] = useState([]);
    const [positions, setPositions] = useState([]);

    const [isFirstNameValid, , firstNameRule] = useValidator(nameValidator('First name'));
    const [isLastNameValid, , lastNameRule] = useValidator(nameValidator('Last name'));
    const [isBranchValid, , branchRule] = useValidator(nameValidator('Branch'));
    const [isPositionValid, , positionRule] = useValidator(requiredValidator('Position'));
    const [isPasswordValid, passwordValue, passwordRule] = useValidator(passwordValidator);
    const [isConfirmPassword, confirmPasswordValue, confirmPasswordRule] = useValidator(passwordValidator);

    const isEntireFormValid = [isFirstNameValid,
        isLastNameValid,
        isBranchValid,
        isPositionValid,
        isPasswordValid,
        isConfirmPassword,
    ].every(e => e) && passwordValue === confirmPasswordValue;

    const navigateTo = useNavigation();

    const [isCompleted, , error] = useService(checkInvitation, token);

    if(error){
        navigateTo(SMConfig.routes.login, {
            error: SMConfig.messages.invitations.nonexistentInvitation.message
        });
    }

    useEffect(() => {
        getBranches()
        .then(result => {
            const branchList = [];
            result.map(item => {
                branchList.push({value: item.name, guid: item.guid})
            });
            setBranches(branchList);
        })
        .catch(error => {
            console.warn('Handle error', error);
        });

        getPositions()
        .then(result => {
            const positionsList = [];
            result.map(item => {
                positionsList.push({value: item.name, guid: item.guid})
            });
            setPositions(positionsList);
        })
        .catch(error => {
            console.warn('Handle error', error);
        });
    },[]);

    const handleSubmit = data => {
        setIsPending(true);
        let branchGuid = "";
        let positionGuid = "";

        branches.map(item => {
            if(item.value === data.branchGuid) {
                branchGuid = item.guid
            }
        });

        positions.map(item => {
            if(item.value === data.positionGuid) {
                positionGuid = item.guid
            }
        });

        const bodyData = {
            branchGuid: branchGuid,
            fname: data.fname,
            lname: data.lname,
            password: data.password,
            started_to_work_date: moment(data.started_to_work_date).format(SMConfig.constants.dateFormat),
		    positionGuid: positionGuid
        }

        registerUser(token, bodyData)
            .then(() => {
                navigateTo(SMConfig.routes.login, {
                    success: 'User has been added'
                });
            })
            .catch(() => {
                setIsPending(false);
            });
    };

    const handleChangeSelect = (value) => {
        return value;
    }

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
                        name: 'branchGuid',
                        placeholder: 'Branch',
                        options: branches,
                        rules: branchRule,
                        onChange: handleChangeSelect
                    }),
                    SMSelect({
                        className: 'sm-select',
                        name: 'positionGuid',
                        placeholder: 'Position',
                        options: positions,
                        rules: positionRule,
                        onChange: handleChangeSelect
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
                        name: 'started_to_work_date',
                        placeholder: 'Start working date',
                        format: SMConfig.constants.dateFormat,
                        rules: [{required: true, message: "Date is required!"}]
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
