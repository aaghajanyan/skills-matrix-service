import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

function SMButton(props) {
    return (
        <Button
            className={props.className || undefined}
            id={props.id || undefined}
            type={props.type || undefined}
            name={props.name || undefined}
            style={props.style || undefined}
            htmlType={props.htmlType || undefined}
            href={ props.href || undefined }
            loading={ props.loading || undefined }
            onClick={props.onClick || undefined}
            target={props.target || undefined}
        >
            {props.children}
    </Button>)
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

export { SMButton };
