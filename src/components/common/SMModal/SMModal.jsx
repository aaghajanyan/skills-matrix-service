import React from 'react';
import { Modal } from 'antd';
import PropTypes, { element } from 'prop-types';

function SMModal({className, title, visible, onOk, onCancel, footer, children }) {
    return (
        <Modal
            title={title}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            footer={footer}
        >
            {children}
        </Modal>
    )
}

SMModal.propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.element,
    footer: PropTypes.arrayOf(element)
}

export { SMModal };