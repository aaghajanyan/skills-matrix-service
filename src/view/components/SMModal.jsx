import React from 'react';
import { Modal } from 'antd';
import PropTypes, { element } from 'prop-types';

function SMModal(props) {
    return (
        <Modal {...props}> {props.children} </Modal>
    )
}

SMModal.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.element,
    footer: PropTypes.arrayOf(element)
}

export { SMModal };