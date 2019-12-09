import * as yup from 'yup';

const emailSchema = yup.object().shape({
    email: yup.string()
    .required("Please input your email!")
    .email("Please input valid email address!"),
});

const passwordSchema = yup.object().shape({
    password: yup.string()
    .required("Please input your password!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})/, "Please input valid password!"),
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

export { emailValidator, passwordValidator };