
import React from 'react';
import { SMMenu } from '../SMMenu/SMMenu';
import classNames from 'classnames';
import PropTypes from 'prop-types';


function SMSiderMenu(props) {
    const siderStyle = props.type === 'sider' && props.isCollapsed ? 'sm-menu-container  sm-menu-container_collapsed-mode' : 
    props.type === 'sider' && !props.isCollapsed ? 'sm-menu-container' : '';
    const classes = classNames(
        props.className,
        siderStyle ,
    );

    return (
        <SMMenu
            type={props.type || undefined}
            defaultSelectedKeys={['']}
            mode={props.mode || ''}
            theme={props.theme || ''}
            className={classes}
            items={props.items}
        >

        </SMMenu>
    );
}
  
SMSiderMenu.propTypes = {
    isCollapsed: PropTypes.bool,
    type: PropTypes.string.isRequired,
    mode: PropTypes.string ,
    theme: PropTypes.string ,
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        href: PropTypes.string,
        className: PropTypes.string,
        iconSrc: PropTypes.string
    }))
};

export { SMSiderMenu };
  