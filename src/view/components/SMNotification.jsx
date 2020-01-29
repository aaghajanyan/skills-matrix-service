import {notification} from 'antd';
import PropTypes from 'prop-types';

const SMNotification = (type, data) => {
    notification[type](data);
};

export { SMNotification };

SMNotification.PropTypes = {
    type: PropTypes.string,
    data: PropTypes.object
};