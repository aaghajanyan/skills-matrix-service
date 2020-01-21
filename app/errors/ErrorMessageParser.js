class ErrorMessageParser {

    static elementDoesNotExist(type, param, paramName) {
        return `${type} with ${param} ${paramName} does not exists`;
    };

    static stringFormatter(str) {
        let args = [].slice.call(arguments);
        args.splice(0, 1)
        return str.replace(/%(\d+)/g, (_, n) => args[+n-1]);
    }

}

module.exports = ErrorMessageParser;
