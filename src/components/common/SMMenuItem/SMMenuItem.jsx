import  React  from 'react';
import { Menu } from 'antd';
import classNames from 'classnames';

function SMMenuItem(props) {
    const siderStyle = props.type === 'sider' ? ' ant-menu-item ' : '';
    const classes = classNames(
        props.className,
        siderStyle ,
      );

    return(
        <Menu.Item
            key={props.key || undefined}
            disabled={props.disabled || 'false'}
            title={props.title || undefined}
            icon={props.icon || undefined}
            href={props.href || undefined}
            className={classes}
            onClick={props.onClick}
        >
            {props.children}
        </Menu.Item>
    );
}

export { SMMenuItem };
