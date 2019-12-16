import { notification } from 'antd';

const SMNotification = (type, data) => {
    notification[type](data);
}

export { SMNotification };