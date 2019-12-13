import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

function SMInput(props) {
    return <Input {...props} />
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
