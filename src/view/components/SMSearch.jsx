import React from 'react';
import {Input} from 'antd';
import PropTypes from 'prop-types';

const {Search} = Input;

function SMSearch(props) {
    return <Search allowClear {...props}/>;
}

SMSearch.propTypes = {
    className: PropTypes.string,
    onSearch: PropTypes.func,
    name: PropTypes.string,
    style: PropTypes.string,
    placeholder: PropTypes.string,
    key: PropTypes.string
};

export {SMSearch};