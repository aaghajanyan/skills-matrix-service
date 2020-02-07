const toRGB = function(str) {
    var hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    let rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        rgb[i] = value;
    }
    // return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    // return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    return {
        borderColor: `rgb(${rgb[0] - (rgb[0])/2 }, ${rgb[1]-(rgb[0])/2}, ${rgb[2]-(rgb[0])/2})`,
        color: `rgb(${rgb[0]-(rgb[0])/1.5}, ${rgb[1]-(rgb[0])/1.5}, ${rgb[2]-(rgb[0])/1.5})`,
        backgroundColor: `rgb(${ rgb[0] + (255-rgb[0])/1.1 }, ${ rgb[1] + (255-rgb[1])/1.1 }, ${ rgb[2] + (255-rgb[2])/1.1 })`
    };
}

export {toRGB};
