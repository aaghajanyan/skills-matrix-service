import React from 'react';
import { Spin } from 'antd';

function SMSpinner({isLoading, children, className, size}) {
    return (
        isLoading ? <Spin className={className} size={size} /> : children
    )
}

export { SMSpinner }