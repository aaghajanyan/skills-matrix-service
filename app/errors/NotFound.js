const CustomError = require('./CustomError');

class NotFound extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'NotFound';
        this.status = 404;
    }
}

module.exports = NotFound;
