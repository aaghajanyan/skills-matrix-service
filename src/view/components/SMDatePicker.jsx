import React from 'react';
import {DatePicker} from 'antd';
import {PropTypes} from 'prop-types';

function SMDatePicker(props) {
    return <DatePicker {...props} />;
}

SMDatePicker.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
    rules: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string,
    dateFormat: PropTypes.string
};

export {SMDatePicker};