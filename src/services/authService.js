import cookie from 'react-cookies';
import {get, post} from 'src/services/client';
import {SMConfig} from "src/config";

export const AUTH_TOKEN = 'auth_token';

const isLoggedIn = () => {
    return cookie.load(AUTH_TOKEN);
};

const login = ({email, password}) => {
    const options = {
        url: `${SMConfig.apiEndpoints.login}`,
        data : {
            email,
            password
        }
    };
    return post(options)
        .then(result => {
            cookie.save(AUTH_TOKEN, result.data.token, {
                path: '/',
                maxAge: 86400,
            });
            return get({ url: `${SMConfig.apiEndpoints.getUsers}/${result.data.guid}` }).then(user => user.data)
        })
        .catch(error => {
            if (error.response) {
                return Promise.reject(error.response.data.message)
            } else if (error.request) {
                //TODO
            } else {
                //TODO
            }
        });
};

const registerUser = (token, {fname, lname, branchName, position, password, startedToWorkDate}) => {
    const options = {
        url: `${SMConfig.apiEndpoints.getUsers}/${token}`,
        data : {
            fname,
            lname,
            branchName,
            position,
            password,
            startedToWorkDate: startedToWorkDate.toString()
        }
    };
    return post(options)
};

const sendPasswordUpdatingLinkTo = (email) => {
    const options = {
        url: SMConfig.apiEndpoints.forgotPassword,
        data : {
            email
        }
    };
    return post(options)
};

const checkResetPasswordToken = (token) => {
    const options = {
        url: `${SMConfig.apiEndpoints.forgotPassword}/change/${token}`,
    };
    return get(options)
};

const changePassword = (token, password) => {
    const options = {
        url: `${SMConfig.apiEndpoints.forgotPassword}/change/${token}`,
        data: { password }
    };
    return post(options)
};


const logOut = () => {
    cookie.remove(AUTH_TOKEN, { path: '/' })
};

export { isLoggedIn, login, logOut, registerUser, sendPasswordUpdatingLinkTo, checkResetPasswordToken, changePassword }