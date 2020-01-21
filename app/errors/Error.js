class Error {
    constructor(status, message = '', result = []) {
      this.message = message;
      this.success = false;
      this.status = status;
      this.name = "Error";
      this.result = result;
    }

    parse(str) {
        let args = [].slice.call(arguments, 1);
        return str.replace(/%s/g, () => args[0]);
    }
}

  module.exports = Error;