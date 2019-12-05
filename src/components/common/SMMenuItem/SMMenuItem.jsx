import  React  from 'react';
import { Menu } from 'antd';

function SMMenuItem(props) {
    return(
        <Menu.Item
            key={props.key || undefined}
            disabled={props.disabled || 'false'}
            title={props.title || undefined}
            icon={props.icon || undefined}
            href={props.href || undefined}
            className={'ant-menu-item ' + props.className  || 'ant-menu-item'}
            onClick={props.onClick}
        >
            {props.children}
        </Menu.Item>
    );
}

export { SMMenuItem };
