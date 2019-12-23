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
}

const authService = new AuthService()
export { authService }