import {Modal} from 'antd';

const confirmDialog = (callback, record) => {
    Modal.confirm({
      title: 'Are you sure delete this task?',
      content: '',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {callback(record)}
    });
}

export {confirmDialog}