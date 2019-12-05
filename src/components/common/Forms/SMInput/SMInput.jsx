import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

function SMInput(props) {
    return (
        <Input
            type={props.type || undefined}
            name={props.name || undefined}
            style={props.style || undefined}
            onChange={props.onChange || undefined}
            placeholder={props.placeholder || undefined}
            rules={props.rules || undefined}
            prefix={props.prefix || undefined }
            autoComplete={props.autoComplete || undefined}
        />
    );
}

SMInput.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.object),
    prefix: PropTypes.element,
    autoComplete: PropTypes.string,
};

export { SMInput };
