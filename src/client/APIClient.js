import axios from "axios";
import { serverUrl } from "../config/config";

export const APIClient = {
    checkInvitationExistence(invitationId) {
        const basePath = `${serverUrl}/invitations`;
        return axios.head(`${basePath}/${invitationId}`);
    },

    createUser(data) {
        const basePath = `${serverUrl}/users`;
        return axios.post(basePath, data);
    },

    login(data) {
        const basePath = `${serverUrl}/users/login`;
        return axios.post(basePath, data);
    }
}
