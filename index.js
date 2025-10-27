import process from 'process';
import http from 'http';
import path from 'path';
import fs from 'fs/promises';

import Logger       from './modules/services/logger.js';
import NoteManager  from './modules/services/notemanager.js';
import ApiRouter    from './modules/rest/apiRouter.js';

import NamesEndpoint from './modules/rest/endpoints/names.js';
import NotesEndpoint from './modules/rest/endpoints/notes.js';
import { pathToFileURL } from 'url';

class Server {

    static mimeTypeMap = {
        // Text types
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.csv': 'text/csv',

        // Image types
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',

        // Audio types
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',

        // Video types
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime',

        // Application/Document types
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.tar': 'application/x-tar',
        '.7z': 'application/x-7z-compressed',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };

    constructor() {
        // Utility
        this.port       = process.env.PORT;
        this.logPath    = process.env.LOG_PATH;
        this.rootDir    = process.cwd();
        
        // Services
        this.logger         = new Logger(this.logPath);
        this.noteManager    = new NoteManager(this.logger);
        this.apiRouter      = new ApiRouter(this.logger);

        // API Endpoints
        this.apiRouter
            .registerEndpoint(new NamesEndpoint(this.logger))
            .registerEndpoint(new NotesEndpoint(this.logger, this.noteManager));
    }

    serverConfused(reqUrl, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>Something Went Very Wrong</h1><p>Something went verywrong on the server.</p>');
    }

    notFound(reqUrl, req, res) {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>404 Not Found</h1><p>The content you are looking for could not be found. Get wrekt.</p>');
    }

    async handlePublic(reqUrl, req, res) {
        try {
            const item = (reqUrl.pathname.endsWith('/') || !path.extname(reqUrl.pathname))
                ? path.join(reqUrl.pathname, 'index.html')
                : reqUrl.pathname;

            const filePath  = path.join(this.rootDir, 'public', item);
            const file      = await fs.readFile(filePath);
            const fileExt   = path.extname(filePath).toLowerCase();
            const mime      = Server.mimeTypeMap[fileExt] || 'application/octet-stream';

            res.writeHead(200, { 'Content-Type': mime });
            res.end(file);

        } catch (err) {
            this.logger.logError(`Public request failed: ${err}`);
            this.notFound(reqUrl, req, res);
        }
    }

    async handleApi(reqUrl, req, res) {
        if (!(this.apiRouter)) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'No API Router configured.' }));
        } else {
            this.apiRouter.handleRequest(reqUrl, req, res);
        }
    }

    start() {
        http.createServer((req, res) => {

            try {
                this.logger.logInformation(`Request received, method: ${req.method}, pathname: ${req.url}`, 'Server');

                const proto = (req.socket.encrypted) ? 'https' : 'http'; // a little redundant but in case
                const url = new URL(`${proto}://${req.headers.host}${req.url}`);

                res.headers['Access-Control-Allow-Origin']  = '*';
                res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
                res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

                // Preflight request first and foremost
                if (req.method === 'OPTIONS') {
                    res.writeHead(204, res.headers);
                    res.end();
                    return;
                }

                // API or public
                if (url.pathname.startsWith('/api')) {
                    this.handleApi(url, req, res);
                } else if (req.method === 'GET') {
                    this.handlePublic(url, req, res);
                } else {
                    throw new Error('Non-GET request for public resource');
                }
            } catch (err) {
                this.serverConfused(url, req, res);
                this.logger.logError(`Server really failed big time ${err}`);
            }

        }).listen(this.port);
        
        this.logger.logInformation('Server started.');
    }
}

new Server().start();
