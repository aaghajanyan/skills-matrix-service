import React from 'react'
import PropTypes from "prop-types"
import classNames from 'classnames';
import {SMAvatar} from "src/view/components";

function SMUserBar({ className, firstName, lastName, size,  onClick , ...rest}) {

    return (
        <div onClick={onClick} {...rest} className={classNames("sm-user-bar", className, onClick ? "pointer": "")} >
            <SMAvatar  name={firstName + ' ' + lastName} size={size}/>
            <span className='sm-user-bar_name unselectable'>{firstName} {lastName}</span>
        </div>
    )
}

SMUserBar.propTypes = {
    className: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    colorCode: PropTypes.number,
    onClick: PropTypes.func
};

export { SMUserBar };