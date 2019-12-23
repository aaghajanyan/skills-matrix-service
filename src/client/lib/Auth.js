import cookie from 'react-cookies'
import { post } from 'client/lib/axiosWrapper';


const login = (formData) => {
    const options = {
        url : "users/login",
        data : formData
    }
    return post(options)
                .then(result => {
                    cookie.save('auth_token', result.data.token, {
                        path: '/',
                        maxAge: 86400,
                    });
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
    cookie.remove('auth_token', { path: '/' })
}

export { login, logOut }