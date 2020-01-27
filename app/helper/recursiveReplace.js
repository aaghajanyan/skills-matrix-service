const replaceAll = (str, searchStr, replaceStr) => {
    if (str.indexOf(searchStr) === -1) {
        return str;
    }
    str = str.replace(searchStr, replaceStr);
    return replaceAll(str, searchStr, replaceStr);
};

module.exports = replaceAll;
