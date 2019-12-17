
import React from 'react';
import { SMMenu } from '../SMMenu/SMMenu';
import { withRouter} from "react-router-dom"
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { authService } from 'client/lib/AuthService';

function SMSiderMenuInitial(props) {

    const siderStyle = props.type === 'sider' && props.isCollapsed ? 'sm-menu-container_collapsed-mode' :
    props.type === 'sider' && !props.isCollapsed ? 'sm-menu-container' : '';
    const classes = classNames(
        props.className,
        siderStyle ,
    );

    const handleSelect = ( {item, key}  ) => {
        const {href} = item.props;
        key === 'logOut' && authService.logOut();
        props.history.push(href)
    }

    return (
        <SMMenu
            type={props.type || undefined}
            mode={props.mode || ''}
            theme={props.theme || ''}
            className={classes}
            items={props.items}
            onSelect={handleSelect}
            defaultSelectedKeys={
                [props.history.location.pathname === '/' ? '/home': props.history.location.pathname ]
            }
        >
        </SMMenu>
    );
}

SMSiderMenuInitial.propTypes = {
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

const SMSiderMenu = withRouter(SMSiderMenuInitial)

export { SMSiderMenu };
