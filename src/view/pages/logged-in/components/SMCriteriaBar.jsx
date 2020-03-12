import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {SMIcon} from 'src/view/components';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {toRGB} from 'src/helpers/generateColor';

library.add(fab, far, fas);

function SMCriteriaBar({className, iconClassName, iconType, iconName, style, name, onClick}) {
    return (
        <div className={classNames('sm-criteria-bar', className, onClick ? 'pointer': '')} >
            {iconType && <SMIcon style={{color: toRGB(iconName).color}} className={iconClassName} iconType={iconType} icon={iconName} />}
            <span className="sm-criteria-bar-name unselectable">{name}</span>
        </div>
    );
}

SMCriteriaBar.propTypes = {
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

export {SMCriteriaBar};