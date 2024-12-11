export const convertFullWidthToHalfWidth = (str: string): string => {
    return str.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};