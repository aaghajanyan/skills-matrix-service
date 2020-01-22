const CustomError = require('../errors/CustomError');

class InternalServerError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
        this.status = 500;
    }
}

module.exports = InternalServerError;
