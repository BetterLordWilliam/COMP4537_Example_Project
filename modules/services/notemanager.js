import fs from 'fs/promises';
import path from 'path';

export default class NoteManager {

    constructor(logger) {
        this.logger = logger;
    }

    async createNote(id, content) {
        try {
            this.logger.logInformation(`Creating new note with ID: ${id}`, 'NoteManager');

            const notePath = path.join('./notes', `${id}.txt`);

            await fs.writeFile(notePath, content, 'utf8');

            return true;

        } catch (err) {
            this.logger.logError(`Failed to write to note with ID: ${id}, ${err}`, 'NoteManager');

            return false;
        }
    }

    async readNote(id) {
        try {
            this.logger.logInformation(`Reading note with ID: ${id}`, 'NoteManager');

            const notePath = path.join('./notes', `${id}.txt`);
            const content  = await fs.readFile(notePath, 'utf8');

            return content;

        } catch (err) {
            this.logger.logError(`Failed to read note with ID: ${id}, ${err}`, 'NoteManager');

            return null;
        }
    }
}