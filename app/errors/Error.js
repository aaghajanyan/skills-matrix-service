class Error {
    constructor(message) {
      this.message = message;
      this.success = false;
      this.name = "Error";
    }

    parse(str) {
        let args = [].slice.call(arguments, 1);
        return str.replace(/%s/g, () => args[0]);
    }
}

  module.exports = Error;