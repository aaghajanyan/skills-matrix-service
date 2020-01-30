import React from 'react';
import PropTypes from 'prop-types';
import {ReactComponent as Logo} from 'src/assets/images/instigate.svg';

function SMLogo({title, isCollapsed}) {

    return (
        <div className="sm-logo-container">
            <a href="/" className="sm-logo-image" >
                <Logo/>
            </a>
            <h1 className={`sm-logo-title ${isCollapsed && 'collapsed'} unselectable`}>{title}</h1>
        </div>
    );
}

SMLogo.prototypes = {
    title: PropTypes.string,
    isCollapsed: PropTypes.bool
};

export {SMLogo};