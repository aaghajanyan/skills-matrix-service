import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';
import {SMIcon} from 'src/view/components';

import logo from 'src/assets/images/instigate.svg';

function SMIconLink(props) {

    const siderStyle = props.parentType === 'sider' ? ' sm-menu-container_title ' : props.parentType === 'dropdown' ? ' ant-dropdown-menu-item ant-dropdown-menu-item_title' : '';

    return (
        <div className="icon-container">
            <Link className="icon-container_link" to={props.href}>
                {props.icon && props.icon === 'sm' ?
                    <img src={logo} alt={props.title} />
                    : props.icon ?
                        <SMIcon
                            className={props.className}
                            iconType="fas"
                            icon={props.icon}
                        /> : null
                }
                {props.title && <span className={siderStyle}> {props.title} </span>}
            </Link>
        </div>
    );
}

SMIconLink.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string,
    href: PropTypes.string
};

export {SMIconLink};
