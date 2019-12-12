import cookie from 'react-cookies'

class AuthService {
    isLoggedIn() {
        return cookie.load('auth_token');
    }

    getAuthHeader() {
        const token = this.isLoggedIn();
        if (token) {
          return {Authorization: `Bearer ${token}`};
        } else {
          return {};
        }
    }
}

const authService = new AuthService()

export { authService }