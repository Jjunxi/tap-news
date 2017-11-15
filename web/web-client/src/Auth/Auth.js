// singleton every methond should be static
class Auth {
    static authenticateUser(token, email) {
        // only same domain can access localStorage (bigger than cookies)
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    }

    static isUserAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static deauthenticateUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getEmail() {
        return localStorage.getItem('email');
    }
}

export default Auth;
