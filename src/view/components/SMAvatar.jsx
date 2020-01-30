import React from 'react';
import PropTypes from 'prop-types';
import Avatar, {ConfigProvider} from 'react-avatar';
import {SMConfig} from '../../config';

function SMAvatar({name, size}) {
    return (
        <ConfigProvider colors={SMConfig.common.colors}>
            <Avatar
                className="sm-avatar"
                name={name}
                round={true}
                size={SMConfig.common.avatars.sizes[size]}
                maxInitials={1}
            />
        </ConfigProvider>
    );
}

SMAvatar.propTypes = {
    name: PropTypes.string,
    size: PropTypes.string
};

export {SMAvatar};