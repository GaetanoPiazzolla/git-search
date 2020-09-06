const slash = require("slash");

export default class Utils {

    static convertWinToUnixFolder(directory) {

        let path = slash(directory);
        path = path.charAt(0).toLowerCase() + path.substring(2);
        path = '/' + path;

        return path;
    }
}
