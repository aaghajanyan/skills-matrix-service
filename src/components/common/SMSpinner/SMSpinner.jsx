import React from 'react';
import { Spin } from 'antd';

function SMSpinner({isLoading, children, className}) {
    return (
        isLoading ? <Spin className={className} size="large" /> :
        {children}
    )
}

export { SMSpinner }