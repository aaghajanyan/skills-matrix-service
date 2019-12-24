
import React from 'react';
import { SMMenu } from 'components/common';
import { withRouter } from "react-router-dom"
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { logOut } from 'client/lib/Auth.js';
import {sideMenuItems} from './sideMenuItems'

function SideMenuInitial(props) {

    const siderStyle = props.type === 'sider' && props.isCollapsed ? 'sm-menu-container_collapsed-mode' :
        props.type === 'sider' && !props.isCollapsed ? 'sm-menu-container' : '';
    const classes = classNames(
        props.className,
        siderStyle ,
    );

    const handleSelect = ({ item, key }) => {
        const { href } = item.props;
        key === 'logOut' && logOut();
        props.history.push(href)
    }

    const selectedKeys = [props.history.location.pathname === '/' ? 'home' : props.history.location.pathname.split('/')[1]];

    return (
        <SMMenu
            type={props.type || undefined}
            mode={props.mode || ''}
            theme={props.theme || ''}
            className={classes}
            items={sideMenuItems}
            onSelect={handleSelect}
            selectedKeys={selectedKeys}
        >
        </SMMenu>
    );
}

SideMenuInitial.propTypes = {
    isCollapsed: PropTypes.bool,
    type: PropTypes.string.isRequired,
    mode: PropTypes.string,
    theme: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        href: PropTypes.string,
        className: PropTypes.string,
        iconSrc: PropTypes.string
    }))
};

const SideMenu = withRouter(SideMenuInitial)

export { SideMenu };
