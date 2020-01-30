import apiEndpoints from './api-endpoints';
import routes from './routes';
import serverConfig from './server-config';
import messages from 'src/config/messages';
import common from 'src/config/common-config';
import search from 'src/config/search';


export const SMConfig = {
    serverConfig: {
        ...serverConfig,
        get serverUrl() {
            return `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.port}`;
        }
    },
    apiEndpoints,
    routes,
    messages,
    common,
    search
};