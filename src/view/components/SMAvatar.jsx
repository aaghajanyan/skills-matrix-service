import React from 'react'
import PropTypes from "prop-types"
import Avatar, { ConfigProvider } from 'react-avatar';
import { avatars, colors } from 'constants'

function SMAvatar({ name, size }) {
    return (
        <ConfigProvider colors={colors}>
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