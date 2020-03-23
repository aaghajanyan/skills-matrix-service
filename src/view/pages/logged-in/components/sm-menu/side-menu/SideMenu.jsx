import React from 'react';
import {SMMenu} from 'src/view/components';
import {useHistory} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {onMenuItemSelect} from '../';

export function SideMenu(props) {

    const history = useHistory();
    const dispatch = useDispatch();

    const currentSelectedMenuItem = history.location.pathname === '/' ? 'home' : history.location.pathname.split('/')[1];

    const onSelect = onMenuItemSelect(history, dispatch);

    const siderStyle = props.type === 'sider' && props.isCollapsed ? 'sm-menu-container_collapsed-mode' :
        props.type === 'sider' && !props.isCollapsed ? 'sm-menu-container' : '';
    const classes = classNames(
        props.className,
        siderStyle ,
    );

    return (
        <SMMenu
            type={props.type}
            mode={props.mode}
            theme={props.theme}
            className={classes}
            items={props.items}
            selectedKeys={[currentSelectedMenuItem]}
            onClick={onSelect}
        >
        </SMMenu>
    );
}

SideMenu.propTypes = {
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
        icon: PropTypes.string
    }))
};