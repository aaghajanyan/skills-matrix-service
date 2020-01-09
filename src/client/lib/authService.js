import cookie from 'react-cookies'
import { post, get } from 'client/lib/axiosWrapper';
import { authTokenKey } from 'constants'

const isLoggedIn = () => {
    return cookie.load(authTokenKey);
}

const login = (formData) => {
    const options = {
        url: "users/login",
        data: formData
    }
    return post(options)
        .then(result => {
            cookie.save(authTokenKey, result.data.token, {
                path: '/',
                maxAge: 86400,
            });
            return get({ url: `users/${result.data.guid}` }).then(user => user.data)
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
}

const logOut = () => {
    cookie.remove(authTokenKey, { path: '/' })
}

export { isLoggedIn, login, logOut }