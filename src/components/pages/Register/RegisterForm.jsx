import React, { Component } from 'react';
import { FormInputs } from './FormInputs';
import { inputsProperties } from 'helpers/userDataInputsProperties';
import { RegisterFormValidatior } from 'helpers/RegisterFormValidator';
import apiService from 'client/APIClient';

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = inputsProperties.reduce(this.getInputsChangeableProps, {});
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getInputsChangeableProps(json, inputProperties) {
        json[inputProperties.name] = { value: '', isValid: '' };
        return json;
    }

    onFieldChange(field, value) {
        if (field !== 'confirmPassword') {
            this.setState({
                [field]: RegisterFormValidatior.checkFieldAndGetProps(
                    field,
                    value
                ),
            });
        }
        if (field === 'password') {
            this.setState({
                confirmPassword: RegisterFormValidatior.checkConfirmPasswordAndGetProps(
                    value,
                    this.state.confirmPassword.value
                ),
            });
        } else if (field === 'confirmPassword') {
            this.setState({
                confirmPassword: RegisterFormValidatior.checkConfirmPasswordAndGetProps(
                    this.state.password.value,
                    value
                ),
            });
        }
    }

    handleSubmit(event) {
        if (RegisterFormValidatior.checkForm(this.state)) {
            this.register();
        } else {
            Object.keys(this.state).forEach(key => {
                if (this.state[key].value === '') {
                    this.setState({ [key]: { value: '', isValid: false } });
                }
            });
        }
        event.preventDefault();
    }

    // TODo move to store
    async register() {
        try {
            await apiService.post("users",{
                invitationId: this.props.invitationId,
                password: this.state.password,
            });
            this.props.history.push('/');
            //TODO notify the client that user is created
        } catch (error) {
            //TODO login the user and redirect to the user summary page
            //TODO notify the client that something went wrong
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormInputs
                    properties={inputsProperties.map(inputProperties => {
                        const isValid = this.state[inputProperties.name]
                            .isValid;
                        return {
                            ...inputProperties,
                            ...this.state[inputProperties.name],
                            isInvalid: isValid === '' ? false : !isValid,
                            onChange: evt =>
                                this.onFieldChange(
                                    inputProperties.name,
                                    evt.target.value
                                ),
                        };
                    })}
                />
                <div>
                    <input
                        type="submit"
                        className="btn btn-primary btn-block"
                        value="Create account"
                    />
                </div>
            </form>
        );
    }
}

export { RegisterForm };
