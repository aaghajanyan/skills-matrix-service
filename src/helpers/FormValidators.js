import * as yup from 'yup';

const emailSchema = yup.object().shape({
    email: yup.string()
    .required("Email is required field!")
    .email("Please input valid email address!"),
});

const passwordSchema = yup.object().shape({
    password: yup.string()
    .required("Password is required field!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})/, "Please input valid password!"),
});

const nameSchema = (type) => yup.object().shape({
    name: yup.string()
    .required(`${type}-name is required field!`)
    .matches(/^[a-z]{2,20}$/i, `Please input valid ${type}-name!`),
});

const validateSchema = (schema, obj, callback) =>  {
    schema.validate(obj)
    .then(function (result) {
        callback();
    })
    .catch(function(err) {
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
                callback('Two passwords that you enter is inconsistent!');
            }
            callback()
        })
        .catch(function(err) {
            callback(err);
        });
}

export { emailValidator, passwordValidator, confirmPasswordValidator, nameValidator };