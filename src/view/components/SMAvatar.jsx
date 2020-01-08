import React from 'react'
import PropTypes from "prop-types"
import Avatar, { ConfigProvider } from 'react-avatar';
import { avatars } from 'constants'

function SMAvatar({ name, size }) {
    return (
        <ConfigProvider colors={avatars.colors}>
            <Avatar
                className='sm-avatar'
                name={name}
                round={true}
                size={avatars.sizes[size]}
            />
        </ConfigProvider>
    )
}

SMAvatar.propTypes = {
    name: PropTypes.string,
    size: PropTypes.string,
}

export { SMAvatar }