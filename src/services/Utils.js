
export default class Utils {

    static convertWinToUnixFolder(path) {

        path = this.slash(path);
        path = path.charAt(0).toLowerCase() + path.substring(2);
        path = '/' + path;

        return path;
    }

    static slash(path) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
        if (isExtendedLengthPath || hasNonAscii) {
            return path;
        }
        return path.replace(/\\/g, '/');
    }
}
