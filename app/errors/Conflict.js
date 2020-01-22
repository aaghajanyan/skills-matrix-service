const CustomError = require('./CustomError');

class Conflict extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Conflict';
        this.status = 409;
    }
}

module.exports = Conflict;
