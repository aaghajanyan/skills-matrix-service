import {SMConfig} from 'src/config';
import {head, post} from './client';


const checkInvitation = (token) => {
    const options = {
        url: `${SMConfig.apiEndpoints.invitations}/${token}`
    };
    return head(options);
};

const sendInvitation = (email) => {
    const options = {
        url: SMConfig.apiEndpoints.invitations,
        data: {email}
    };
    return post(options);
};

export {checkInvitation, sendInvitation};