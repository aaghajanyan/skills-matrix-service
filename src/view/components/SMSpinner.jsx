import React from 'react';
import {Spin} from 'antd';
import PropTypes from 'prop-types';

function SMSpinner({isLoading, children, className, size}) {
    return (

        <Spin className={className} size={size} spinning={isLoading} >
            {children}
        </Spin>
    )
}

export { SMSpinner }

SMSpinner.propTypes = {
    isLoading: PropTypes.bool,
    children: PropTypes.element,
    className: PropTypes.string,
    size: PropTypes.string
};