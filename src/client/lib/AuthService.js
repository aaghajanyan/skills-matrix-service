import cookie from 'react-cookies'

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