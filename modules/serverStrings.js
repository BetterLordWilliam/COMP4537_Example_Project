export default class ServerStrings {
    static LOG_INFO = (message, tag) => {
        return `INFO\t${new Date()}\t${tag}\t\t${message}`;
    }
    static LOG_ERROR = (message, tag) => {
        return `ERROR\t${new Date()}\t${tag}\t\t${message}`;
    }

    static NAMES_ENDPOINT = '/names';
    static FILE_ENDPOINT = '/file';
}
