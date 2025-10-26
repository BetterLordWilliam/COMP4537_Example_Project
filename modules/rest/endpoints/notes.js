import ApiEndpoint from '../apiEndpoint.js';
import ServerStrings from '../../serverStrings.js';

export default class NoteEndpoint extends ApiEndpoint {
    constructor(logger, noteManager) {
        super(logger, ServerStrings.NOTES_ENDPOINT);
        this.noteManager = noteManager;
    }

    async get(reqUrl, req, res) {
        this.logger.logInformation(`Request request received ${reqUrl.searchParams}`, 'NoteEndpoint');

        // Check search params for ID (aka business logic)
        const id = reqUrl.searchParams.get('id');

        if (!id) {
            ApiEndpoint.writeBadRequestResponse(res, {
                message: 'You are required to specify a notes `id`'
            }, 10);
        } else {
            const data = await this.noteManager.readNote(id);

            if (!data) {
                ApiEndpoint.writeServerErrorResponse(res, {
                    message: `Note with id \'${id}\' could not be read, likely does not exist`
                }, 10);
            } else {
                ApiEndpoint.writeSuccessResponse(res, {
                    message: `Successfully read note with id \'${id}\'`,
                    content: data
                }, 10);
            }
        }
    }

    async post(reqUrl, req, res) {
        const data = [];

        req.on('data', chunk => data.push(chunk));
        req.on('end', async () => {
            const parsedData = JSON.parse(Buffer.concat(data).toString());

            this.logger.logInformation('Parsed incoming data', 'NoteEndpoint');

            if (!parsedData.id || !parsedData.content) {
                ApiEndpoint.writeBadRequestResponse(res, {
                    message: 'To create a new note you need to specify the \'id\' and \'content\' parameters'
                }, 10);
            } else {
                const status = await this.noteManager.createNote(parsedData.id, parsedData.content);
                if (!status) {
                    ApiEndpoint.writeServerErrorResponse(res, {
                        message: `Could not create note with id ${parsedData.id}`
                    }, 10);
                } else {
                    ApiEndpoint.writeSuccessResponse(res, {
                        messge: `Successfully created note with id ${parsedData.id}`
                    }, 10);
                }
            }
        });
    }
}