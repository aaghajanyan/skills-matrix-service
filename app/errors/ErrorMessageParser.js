class ErrorMessageParser {
    constructor(){}

    notExists(type, param, paramName) {
        return `${type} with ${param} ${paramName} does not exists`;
    };

    couldNot(type, modelName) {
        return `Could not ${type} ${modelName}`;
    }

    parse(str) {
        let args = [].slice.call(arguments, 1);
        return str.replace(/%s/g, () => args[0]);
    }

}

module.exports = ErrorMessageParser;