import React from 'react';
import PropTypes from 'prop-types';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(fab, far, fas);

function SMIcon({iconType, icon, ...props}) {
    return <FontAwesomeIcon {...props} icon={[iconType, icon]}> </FontAwesomeIcon>
}

SMIcon.propTypes = {
    iconType: PropTypes.oneOf(['fab', 'far', 'fas']),
    icon: PropTypes.string,
    onClick: PropTypes.func,
    key: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    visibility: PropTypes.string
};

export {SMIcon};