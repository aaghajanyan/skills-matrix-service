import * as yup from 'yup';
import {SMConfig} from '../config';
import * as util from 'util';

const emailSchema = yup.object().shape({
    email: yup.string()
        .required(SMConfig.messages.validation.email.required)
        .email(SMConfig.messages.validation.email.invalid)
});

const passwordSchema = yup.object().shape({
    password: yup.string()
        .required(SMConfig.messages.validation.password.required)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})/, SMConfig.messages.validation.password.invalid)
});

const nameSchema = (type) => {
    const nameFormat = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return yup.object().shape({
    name: yup.string()
        .required(util.format(nameFormat,SMConfig.messages.validation.name.required))
        .matches(/^[a-z]{2,20}$/i, util.format(nameFormat, SMConfig.messages.validation.name.invalid))
    })
};

const defaultSchema = (type) => yup.object().shape({
    name: yup.string()
        .required(`${type} is required`)
});

const numberSchema = (type) => {
    return yup.object().shape({
    name: yup.string()
        .required(SMConfig.messages.validation[type].required)
        .matches(type === "experience" ? /^(?:[1-9]|0[1-9]|10)$/i : /^[1-5]$/i, SMConfig.messages.validation[type].invalid)
    })
};

export const requiredValidator = (type) => (rule, value, callback) => {
    validateSchema(defaultSchema(type), {name: value}, callback);
};

const validateSchema = (schema, obj, callback) => {
    schema.validate(obj)
        .then(function() {
            callback();
        })
        .catch(function(err) {
            callback(err);
        });
};

const passwordValidator = (rule, value, callback) => {
    validateSchema(passwordSchema, {password: value}, callback);
};

const emailValidator = (rule, value, callback) => {
    validateSchema(emailSchema, {email: value}, callback);
};

const nameValidator = (type) => (rule, value, callback) => {
    validateSchema(nameSchema(type), {name: value}, callback);
};

const numberValidator = (type) => (rule, value, callback) => {
    validateSchema(numberSchema(type),{name: value}, callback);
}

export {emailValidator, passwordValidator, nameValidator, numberValidator};