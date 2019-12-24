import React from 'react';
import { Link } from 'react-router-dom';
import { SVG } from 'assets/svg/SVG';
import { SVGIcons } from 'assets/svg/SVGIcons';
import classNames from 'classnames';
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
                {props.iconSrc && props.iconSrc==='sm' ?
                    <img src={logo} alt={props.title} />
                    : props.iconSrc ?
                    <SVG name={props.iconSrc}
                        className={props.className}
                        svg={SVGIcons[props.iconSrc]}
                    /> : null }
                {props.title && <span className={classes}> {props.title} </span>}
            </Link>
        </div>
    );
}

SMIconLink.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    iconSrc: PropTypes.string.isRequired,
    title: PropTypes.string,
    href: PropTypes.string
};

export { SMIconLink };
