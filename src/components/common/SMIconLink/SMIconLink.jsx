import React from 'react';
import { Link } from 'react-router-dom';
import { Svg } from '../Svg';
import { SvgIcons } from '../SvgIcons';
import classNames from 'classnames';
import logo from '../../../assets/images/instigate.svg';
import PropTypes from 'prop-types';

function SMIconLink(props) {

    const siderStyle = props.parentType === 'sider' ? ' sm-menu-container_title ' : props.parentType === 'dropdown' ? ' ant-dropdown-menu-item ant-dropdown-menu-item_title' : '';
    const classes = classNames(
        siderStyle ,
      );

    return (
        <div className='icon-container'>
            <Link className='icon-container_link' to={props.href || ''}>
                {props.iconSrc && props.iconSrc==='sm' ? 
                    <img src={logo} alt={props.title} /> 
                    : props.iconSrc ?
                    <Svg name={props.iconSrc}
                        svg={SvgIcons[props.iconSrc]}
                    /> : null }
                {props.title && <span className={classes}> {props.title} </span>}
            </Link>
        </div>
    );
}

SMIconLink.propTypes = {
    type: PropTypes.string.isRequired,
    iconSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
};

export { SMIconLink };