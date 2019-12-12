import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

function SMButton(props) {
    return (
        <Button
            id={props.id || undefined}
            className={props.className || undefined}
            type={props.type || undefined}
            name={props.name || undefined}
            style={props.style || undefined}
            htmlType={props.htmlType || undefined}
            href={ props.href || undefined }
            onClick={props.onClick || undefined}
        >
            {props.children}
        </Button>
    );
}

SMButton.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    htmlType: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
};

export { SMButton };
