import {Modal} from 'antd';

const SMConfirmModal = (callback, e, record, title='Are you sure to delete this record ?') => {
  e.stopPropagation();
    Modal.confirm({
      title: title,
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        callback(record);
      }
    });
}

export {SMConfirmModal}