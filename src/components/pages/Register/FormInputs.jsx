import React, { Component } from 'react';
// import { FormGroup, FormLabel, FormControl } from "react-bootstrap";

class FormInputs extends Component {
    render() {
        // const { properties } = this.props;
        return (
            <div>
                {/* {properties.map(inputProperties => {
                    const {
                        id,
                        label,
                        errorMessage,
                        ...formControlProperties
                    } = inputProperties;
                    return (
                        <FormGroup key={id}>
                            <FormLabel>{label}</FormLabel>
                            <FormControl {...formControlProperties} />
                            {formControlProperties.isInvalid && (
                                <div className="invalid-feedback">
                                    {formControlProperties.value === ""
                                        ? "This field is required"
                                        : errorMessage}
                                </div>
                            )}
                        </FormGroup>
                    );
                })} */}
            </div>
        );
    }
}

export { FormInputs };
