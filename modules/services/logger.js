import fs from 'fs/promises';
import process from 'process';
import path from 'path';
import ServerStrings from '../serverStrings.js';

export default class Logger {
    constructor(logsPath, toConsole = true, toFile = true) {
        this.info       = null;
        this.error      = null;
        this.warning    = null;
        this.toConsole  = toConsole;
        this.toFile     = toFile;

        if (this.toFile) {
            this.logsPath = logsPath;
        }
    }

    async logInformation(message, tag = '') {
        const formattedLogLine = ServerStrings.LOG_INFO(message, tag);
        if (this.toFile) {
            await fs.appendFile(this.logsPath + '/info.log', formattedLogLine + '\n');
        }
        if (this.toConsole) {
            console.log(formattedLogLine);
        }
    }

    async logError(message, tag = '') {
        const formattedLogLine = ServerStrings.LOG_ERROR(message, tag);
        if (this.toFile) {
            await fs.appendFile(this.logsPath + '/error.log', formattedLogLine + '\n');
        }
        if (this.toConsole) {
            console.log(formattedLogLine);
        }
    }
}
