import {Modal} from 'antd';

const SMConfirmModal = (callback, record, title='Are you sure to delete this record ?') => {
    Modal.confirm({
      title: title,
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {callback(record)}
    });
}

export {SMConfirmModal}