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

const nameSchema = yup.object().shape({
    name: yup.string()
    .required("First name is required field!")
    .matches(/^[a-z]{2,20}$/i, "Please input valid name!"),
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

const nameValidator = (rule, value, callback) => {
    validateSchema(nameSchema, { name: value }, callback);
}

export { emailValidator, passwordValidator, nameValidator };