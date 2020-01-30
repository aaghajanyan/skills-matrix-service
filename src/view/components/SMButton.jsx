import React from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';

function SMButton(props) {
    return <Button {...props}> {props.children} </Button>;
}

SMButton.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    htmlType: PropTypes.string,
    href: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    target: PropTypes.string
};

export {SMButton};