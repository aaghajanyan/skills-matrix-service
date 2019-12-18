import React from 'react'
import PropTypes from "prop-types"
import classNames from 'classnames';
import { Avatar } from 'antd';

const generateAvatarUrl = (firstname, lastname, colorCode) =>
    `https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=${colorCode}&color=fff&SameSite=None&Secure`

function SMUserBar({ className, firstName, lastName, colorCode, size, avatarUrl = generateAvatarUrl(firstName, lastName, colorCode) }) {

    return (
        <span className={classNames("sm-user-bar", className)} >
            <Avatar src={avatarUrl} alt={`${firstName} ${lastName}`} size={size} />
            {firstName} {lastName}
        </span>
    )
}

SMUserBar.propTypes = {
    className: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    colorCode: PropTypes.number,
    size: PropTypes.string,
}

export { SMUserBar };