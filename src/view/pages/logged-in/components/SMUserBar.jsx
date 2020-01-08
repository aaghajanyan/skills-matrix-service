import React from 'react'
import PropTypes from "prop-types"
import classNames from 'classnames';
import { SMAvatar } from 'view/components'

function SMUserBar({ className, firstName, lastName, size }) {

    return (
        <div className={classNames("sm-user-bar", className)} >
            <SMAvatar  name={firstName + ' ' + lastName} size={size}/>
            <span className='sm-user-bar_name'>{firstName} {lastName}</span>
        </div>
    )
}

SMUserBar.propTypes = {
    className: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    colorCode: PropTypes.number,
}

export { SMUserBar };