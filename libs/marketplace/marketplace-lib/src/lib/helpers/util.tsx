function stringToColor(string:string)
{
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 1; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}
function initialSelection(string:string)
{

    const selectVal=string.split(string.includes(' ')?' ':'');
    const initials = (selectVal && selectVal.length>0) ? (selectVal[0][0] + selectVal[1][0]) : "";
return initials.toUpperCase();
}
export {stringToColor,initialSelection};