import React from 'react';
import { getComponent } from '../Icons';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

function SMIconLink(props) {

    const siderStyle = props.parentType === 'sider' ? ' sm-menu-container_title ' : props.parentType === 'dropdown' ? ' ant-dropdown-menu-item ant-dropdown-menu-item_title' : '';
    const classes = classNames(
        siderStyle ,
      );

    return (
        <div className='icon-container'>
            <Link className='icon-container_link' to={props.href || ''}>
                {props.iconSrc && <img src={getComponent(props.iconSrc)} alt={props.title} />}
                {props.title && <span className={classes}> {props.title} </span>}
            </Link>
        </div>
    );
}

export { SMIconLink };