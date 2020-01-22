const CustomError = require('./CustomError');

class BadRequest extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
        this.status = 400;
    }
}

module.exports = BadRequest;
