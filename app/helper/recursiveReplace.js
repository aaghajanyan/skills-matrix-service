const replaceAllByList = (str, searchStrList, replaceStr, delBrackets = false) => {
    for (let i = 0; i < searchStrList.length; ++i) {
        str = replaceAll(str, searchStrList[i], replaceStr, delBrackets);
        str = str.replace(/  +/g, ' ');
    }
    return str;
};

const replaceAll = (str, searchStr, replaceStr, delBrackets = false) => {
    if (delBrackets) {
        str = str.replace(new RegExp(/\s?\([ ]+\)/, 'g'), '()');
    }
    if(str.indexOf(searchStr) === -1) {
        return str;
    }
    str = str.replace(searchStr, replaceStr).replace(/  +/g, ' ');
    return replaceAll(str, searchStr, replaceStr, delBrackets);
};

module.exports = replaceAllByList;
