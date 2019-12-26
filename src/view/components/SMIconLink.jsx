import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { SMIcon } from 'view/components'
import logo from 'assets/images/instigate.svg';
import PropTypes from 'prop-types';

function SMIconLink(props) {

    const siderStyle = props.parentType === 'sider' ? ' sm-menu-container_title ' : props.parentType === 'dropdown' ? ' ant-dropdown-menu-item ant-dropdown-menu-item_title' : '';
    const classes = classNames(
        siderStyle ,
    );

    return (
        <div className='icon-container'>
            <Link className='icon-container_link' to={props.href || ''}>
                {props.icon && props.icon==='sm' ?
                    <img src={logo} alt={props.title} />
                    : props.icon ?
                    <SMIcon
                        className={props.className}
                        iconType='fas'
                        icon={props.icon}
                    /> : null
                }
                {props.title && <span className={classes}> {props.title} </span>}
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

export { SMIconLink };
