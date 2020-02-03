import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(fab, far, fas);

function SMSkillBar({className, icon, style, name, onClick}) {

    const colorCodeMaker = () => Math.floor(100000 + Math.random() * 900000);

    // TODO use SMIcon
    return (
        <div className={classNames('sm-skill-bar', className, onClick ? 'pointer': '')} >
            <FontAwesomeIcon icon={icon} style={style}/>
            <span className="sm-skill-bar_name unselectable">{name}</span>
        </div>
    );
}

SMSkillBar.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.shape({
        width: PropTypes.string,
        height: PropTypes.string
    }),
    name: PropTypes.string,
    onClick: PropTypes.func
};

export {SMSkillBar};