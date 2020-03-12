import * as colorHash from 'color-hash';

export const toRGB = function(str) {

    const colorH = new colorHash({lightness: [0.4, 0.4, 0.4]})
    const borderColorH = new colorHash({lightness: [0.7, 0.8, 0.7]})
    const backgroundColorH = new colorHash({lightness: [0.9, 0.9, 0.9]})

    const colorHRGB = colorH.rgb(str);
    const borderColorHRGB = borderColorH.rgb(str);
    const backgroundColorHRGB = backgroundColorH.rgb(str);

    return  {
        color: `rgb(${colorHRGB[0] }, ${colorHRGB[1]}, ${colorHRGB[2]})`,
        borderColor: `rgb(${borderColorHRGB[0] }, ${borderColorHRGB[1]}, ${borderColorHRGB[2]})`,
        backgroundColor: `rgb(${backgroundColorHRGB[0] }, ${backgroundColorHRGB[1]}, ${backgroundColorHRGB[2]})`,
    };
}
