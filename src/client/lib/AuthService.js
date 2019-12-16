import cookie from 'react-cookies'
import { post } from 'client/lib/axiosWrapper';

class AuthService {
    isLoggedIn() {
        return cookie.load('auth_token');
    }

    getAuthHeader() {
        const token = this.isLoggedIn();
		  return {Authorization: `Bearer ${token}`};
    }

    login(formData) {
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

    logOut() {
        cookie.remove('auth_token', { path: '/' })
    }
}

const authService = new AuthService()
export { authService }