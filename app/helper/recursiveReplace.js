const replaceAll = (str, searchStr, replaceStr) => {
    if(str.indexOf(searchStr) === -1) {
        return str;
    }
    str = str.replace(searchStr, replaceStr);
    return replaceAll(str, searchStr, replaceStr);
};

const replaceAllAndDeleteSpaces = (str, searchStr, replaceStr) => {
    str = str.replace(new RegExp(/\s?\([ ]+\)/, 'g'), '()');

    if(str.indexOf(searchStr) === -1) {
        return str;
    }
    str = str.replace(searchStr, replaceStr);
    return replaceAll(str, searchStr, replaceStr);
};

module.exports = {replaceAll, replaceAllAndDeleteSpaces};
