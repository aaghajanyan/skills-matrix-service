const replaceAll = (str, searchStr, replaceStr, delBrackets = false) => {
    if (delBrackets) {
        str = str.replace(new RegExp(/\s?\([ ]+\)/, 'g'), '()');
    }
    if(str.indexOf(searchStr) === -1) {
        return str;
    }
    str = str.replace(searchStr, replaceStr);
    return replaceAll(str, searchStr, replaceStr, delBrackets);
};

module.exports = replaceAll;
