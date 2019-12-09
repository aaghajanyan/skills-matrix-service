import  React  from 'react';
import { Menu } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
            href={props.href || undefined}
            className={classes}
            onClick={props.onClick}
        >

            {props.children}
        </Menu.Item>
    );
}

SMMenuItem.propTypes = {
    type: PropTypes.string.isRequired,
    disabled: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
};

export { SMMenuItem };
