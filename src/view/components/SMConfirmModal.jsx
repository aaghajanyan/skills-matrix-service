import React from 'react';
import {Modal} from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const SMConfirmModal = (callback, e, record, title='Are you sure to delete this record ?') => {
    e && e.stopPropagation();
    Modal.confirm({
        title: 'Confirmation',
        content: title,
        icon: <WarningOutlined/>,
        okText: 'Yes',
        cancelText: 'Cancel',
        autoFocusButton: 'Cancel',
        centered: true,
        maskClosable: true,
        onCancel: () => {},
        onOk: () => {
            callback(record);
        }
    });
}

export {SMConfirmModal}