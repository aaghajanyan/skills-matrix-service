import React from 'react'
import PropTypes from "prop-types"
import classNames from 'classnames';
import { Avatar } from 'antd';

const generateAvatarUrl = (firstname, lastname) =>
`https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=${Math.floor(100000 + Math.random() * 900000)}&color=fff&SameSite=None&Secure`

function SMUserBar({ className, firstName, lastName, size,  avatarUrl = generateAvatarUrl(firstName, lastName) }) {
    return (
        <span className={classNames("sm-user-bar", className)} >
            <Avatar src={avatarUrl} alt={`${firstName} ${lastName}`} size={size} />
            {firstName} {lastName}
        </span>
    )
}

SMUserBar.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired
}

export { SMUserBar };