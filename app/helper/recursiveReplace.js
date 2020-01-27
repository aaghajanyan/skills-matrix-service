module.exports.replaceAll = function(str, searchStr, replaceStr) {
    if (str.indexOf(searchStr) === -1) {
        return str;
    }
    str = str.replace(searchStr, replaceStr);
    return replaceAll(str, searchStr, replaceStr);
};
