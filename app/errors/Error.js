class Error {
    constructor(status = 200, message = '', result = []) {
        this.message = message;
        this.result = result;
        this.success = false;
        this.status = status;
        this.name = "Error";
    }

    parse(str) {
        let args = [].slice.call(arguments, 1);
        return str.replace(/%s/g, () => args[0]);
    }
}

  module.exports = Error;
