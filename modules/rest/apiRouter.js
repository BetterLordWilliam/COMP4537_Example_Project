export default class ApiRouter {
    constructor(logger, basePath = '') {
        this.logger     = logger;
        this.basePath   = basePath;
        this.endpoints  = [];
    }

    pathify(resourceName) { 
        return `/api${this.basePath}${resourceName}`;
    }

    endpointNotFound(reqUrl, req, res) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No such endpoint under this router.' }));

        this.logger.logError(`Endpoint not found: ${reqUrl.pathname}`, 'ApiRouter');
    }
    
    registerEndpoint(endpoint) {
        this.endpoints.push(endpoint);

        return this;
    }

    handleRequest(reqUrl, req, res) {
        let mEndpoint;

        for (const endpoint of this.endpoints) {

            const endpointPath = this.pathify(endpoint);

            if (endpointPath === reqUrl.pathname) {
                this.logger.logInformation('Resource endpoint located', 'ApiRouter');
                mEndpoint = endpoint;
            } else {
                continue;
            }
        }

        if (!mEndpoint) {
            this.endpointNotFound(reqUrl, req, res);
            return;
        }

        // Invoke the corresponding REST method
        switch (req.method) {
            case 'GET':
                mEndpoint.get(reqUrl, req, res);
                break;
            case 'POST':
                mEndpoint.post(reqUrl, req, res);
                break;
            case 'PUT':
                mEndpoint.put(reqUrl, req, res);
                break;
            case 'PATCH':
                mEndpoint.patch(reqUrl, req, res);
                break;
            case 'DELETE':
                mEndpoint.delete(reqUrl, req, res);
                break;
            default:
                mEndpoint.get(reqUrl, req, res);
                break;
        }
    }
}
