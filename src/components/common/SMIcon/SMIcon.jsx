import React from 'react';
import { getComponent } from '../Icons';
import { Icon } from 'antd';

function SMIcon(props) {
    const component = props.component ? getComponent(props.component) : undefined;
    return (
        <Icon
            type={props.type || undefined}
            style={props.style || undefined}
            theme={props.theme || undefined}
            onClick={props.onClick || undefined}
            component={component}
        >
            {props.component}
        </Icon>
    );
}

export { SMIcon };