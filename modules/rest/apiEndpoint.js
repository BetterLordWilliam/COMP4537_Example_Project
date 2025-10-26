import ServerStrings from '../serverStrings.js';

export default class ApiEndpoint {

    constructor(logger, resourceName) {
        this.logger = logger;
        this.resourceName = resourceName;
    }

    // Default handler for unimplemented methods
    static unimplemented(res) {
        res.writeHead(500, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ message: 'Unimplemeneted endpoint' }));
    }

    static writeSuccessResponse(res, data, modifier = 0) {
        res.writeHead(200 + modifier, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(data));
    }

    static writeBadRequestResponse(res, data, modifier = 0) {
        res.writeHead(400 + modifier, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(data));
    }

    static writeServerErrorResponse(res, data, modifier = 0) {
        res.writeHead(500 + modifier, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(data));
    }

    // HTTP GET
    async get(reqUrl, req, res) {
        ApiEndpoint.unimplemented(res);
        this.logger.logError(`Unimplemeneted GET method called on endpoint: ${this.resourceName}`, 'ApiEndpoint');
    }

    // HTTP POST
    async post(reqUrl, req, res) {
        ApiEndpoint.unimplemented(res);
        this.logger.logError(`Unimplemeneted POST method called on endpoint: ${this.resourceName}`, 'ApiEndpoint');
    }

    // HTTP PUT
    async put(reqUrl, req, res) {
        ApiEndpoint.unimplemented(res);
        this.logger.logError(`Unimplemeneted PUT method called on endpoint: ${this.resourceName}`, 'ApiEndpoint');
    }

    // HTTP PATCH
    async patch(reqUrl, req, res) {
        ApiEndpoint.unimplemented(res);
        this.logger.logError(`Unimplemeneted PATCH method called on endpoint: ${this.resourceName}`, 'ApiEndpoint');
    }

    // HTTP DELETE
    async delete(reqUrl, req, res) {
        ApiEndpoint.unimplemented(res);
        this.logger.logError(`Unimplemeneted DELETE method called on endpoint: ${this.resourceName}`, 'ApiEndpoint');
    }

    toString() {
        return this.resourceName;
    }
}
