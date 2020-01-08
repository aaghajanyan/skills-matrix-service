import * as yup from 'yup';
import { messages } from 'constants'

const emailSchema = yup.object().shape({
    email: yup.string()
        .required(messages.validation.email.required)
        .email(messages.validation.email.invalid),
});

const passwordSchema = yup.object().shape({
    password: yup.string()
        .required(messages.validation.password.required)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})/, messages.validation.password.invalid),
});

const nameSchema = (type) => yup.object().shape({
    name: yup.string()
        .required(messages.validation.name.required[type])
        .matches(/^[a-z]{2,20}$/i, messages.validation.name.invalid[type]),
});

const validateSchema = (schema, obj, callback) => {
    schema.validate(obj)
        .then(function (result) {
            callback();
        })
        .catch(function (err) {
            callback(err);
        });
}

const passwordValidator = (rule, value, callback) => {
    validateSchema(passwordSchema, { password: value }, callback);
}

const emailValidator = (rule, value, callback) => {
    validateSchema(emailSchema, { email: value }, callback);
}

const nameValidator = (type) => (rule, value, callback) => {
    validateSchema(nameSchema(type), { name: value }, callback);
}

const confirmPasswordValidator = (password) => (rule, value, callback) => {
    passwordSchema.validate({ password: value })
        .then(() => {
            if (value && value !== password) {
                callback(messages.validation.password.passwordsDoNotMatch);
            }
            callback()
        })
        .catch(function (err) {
            callback(err);
        });
}

export { emailValidator, passwordValidator, confirmPasswordValidator, nameValidator };