import cookie from 'react-cookies'

class AuthService {
    isLoggedIn() {
        return cookie.load('auth_token');
    }
}

const authService = new AuthService()

export { authService }