class CustomError {
    constructor(status = 200, message = '', result = []) {
        this.message = message;
        this.result = result;
        this.success = false;
        this.status = status;
        this.name = 'Error';
    }
}

module.exports = CustomError;
