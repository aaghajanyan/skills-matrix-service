import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {SMIcon} from 'src/view/components';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

library.add(fab, far, fas);

function SMSkillBar({className, iconClassName, iconType, iconName, style, name, onClick}) {

    // TODO use SMIcon
    return (
        <div className={classNames('sm-skill-bar', className, onClick ? 'pointer': '')} >
            <SMIcon className={iconClassName} iconType={iconType} icon={iconName} />
            <span className="sm-skill-bar-name unselectable">{name}</span>
        </div>
    );
}

SMSkillBar.propTypes = {
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    iconType: PropTypes.string,
    iconName: PropTypes.string,
    style: PropTypes.shape({
        width: PropTypes.string,
        height: PropTypes.string
    }),
    name: PropTypes.string,
    onClick: PropTypes.func
};

export {SMSkillBar};