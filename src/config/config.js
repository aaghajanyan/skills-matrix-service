import config from "./env-settings.json";

const serverUrl = `${config.server_protocol}://${config.server_host}:${config.server_port}`;

export {serverUrl};
