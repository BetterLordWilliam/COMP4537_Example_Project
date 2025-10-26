import ServerStrings from '../../serverStrings.js';
import ApiEndpoint from '../apiEndpoint.js';

export default class NamesEndpoint extends ApiEndpoint {
    constructor(logger) {
        super(logger, ServerStrings.NAMES_ENDPOINT);
    }

    async get(reqUrl, req, res) {
        ApiEndpoint.writeSuccessResponse(res, {
            message: 'This is a test',
            data: [
                'Will Otterbein',
                'Sammy Swimmer',
                'Dude Cool'
            ]
        }, 10);
    }
}