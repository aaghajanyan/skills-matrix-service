import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {SMAvatar} from 'src/view/components';

function SMUserBar({className, firstName, lastName, size, onClick, ...rest}) {

    const colorCodeMaker = () => Math.floor(100000 + Math.random() * 900000);

    return (
        <div onClick={onClick} {...rest} colorcode={colorCodeMaker()} className={classNames('sm-user-bar', className, onClick ? 'pointer': '')} >
            <SMAvatar name={`${firstName} ${lastName}`} size={size}/>
            <span className="sm-user-bar_name unselectable">{firstName} {lastName}</span>
        </div>
    );
}

SMUserBar.propTypes = {
    className: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    onClick: PropTypes.func
};

export {SMUserBar};