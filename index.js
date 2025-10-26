import process from 'process';
import http from 'http';

import Logger       from './modules/services/logger.js';
import ApiRouter    from './modules/rest/apiRouter.js';

import NamesEndpoint from './modules/rest/endpoints/names.js';

class Server {
    constructor() {
        // Utility
        this.port       = process.env.PORT;
        this.logPath    = process.env.LOG_PATH;
        
        // Services
        this.logger     = new Logger(this.logPath);
        this.apiRouter  = new ApiRouter(this.logger);

        // API Endpoints
        this.apiRouter
            .registerEndpoint(new NamesEndpoint(this.logger));
    }

    serverConfused(reqUrl, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>Something Went Very Wrong</h1><p>Something went verywrong on the server.</p>');
    }

    handlePublic(reqUrl, req, res) {
        // res.writeHead(200, {
        //     'Content-Type': 'text/html'
        // });
        // res.end('<h1>Hello World</h1><p>This is the main page for now</p>');

        
    }

    handleApi(reqUrl, req, res) {
        if (!(this.apiRouter)) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'No API Router configured.' }));
        } else {
            this.apiRouter.handleRequest(reqUrl, req, res);
        }
    }

    start() {
        http.createServer((req, res) => {
            this.logger.logInformation(`Request received, method: ${req.method}, pathname: ${req.url}`, 'Server');

            const proto = (req.socket.encrypted) ? 'https' : 'http'; // a little redundant but in case
            const url = new URL(`${proto}://${req.headers.host}${req.url}`);

            // console.log(url.href);
            // console.log(url.pathname);
            // console.log(url.searchParams);

            // API or public
            if (url.pathname.startsWith('/api')) {
                this.handleApi(url, req, res);
            } else if (req.method === 'GET') {
                this.handlePublic(url, req, res);
            } else {
                this.serverConfused(url, req, res);
            }

        }).listen(this.port);
        
        this.logger.logInformation('Server started.');
    }
}

new Server().start();
