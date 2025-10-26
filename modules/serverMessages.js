export default class ServerMessages {
    static ENDPOINT_NOT_FOUND = (endpointResource) => {
        return `Endpoint not found: ${endpointResource}`;
    }

    static METHOD_NOT_IMPLEMENTED = 'Method not implemented';
}