import {Modal} from 'antd';

const SMConfirmModal = (callback, e, record, title='Are you sure to delete this record ?') => {
    e && e.stopPropagation();
    Modal.confirm({
        title: title,
        content: '',
        okText: 'Yes',
        cancelText: 'No',
        autoFocusButton: 'cancel',
        // centered: true,
        onCancel: () => {},
        onOk: () => {
            callback(record);
        }
    });
}

export {SMConfirmModal}