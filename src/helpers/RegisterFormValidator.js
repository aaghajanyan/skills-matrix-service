const passwordExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})/;
const nameExp = /^[a-z]{2,20}$/i;

class RegisterFormValidatior {
    static checkFieldAndGetProps(field, value) {
        const regexp = field === "password" ? passwordExp : nameExp;
        const isValid = value.match(regexp);
        return { value: value, isValid: isValid };
    }

    static checkConfirmPasswordAndGetProps(password, confirmPassword) {
        const isValid =
            password && confirmPassword ? password === confirmPassword : "";
        return { value: confirmPassword, isValid: isValid };
    }

    static checkForm(state) {
        let isValid = true;
        Object.keys(state).forEach(key => {
            if (state[key].isValid === "" || state[key].isValid === false) {
                isValid = false;
                return;
            }
        });
        return isValid;
    }
}

export { RegisterFormValidatior };
