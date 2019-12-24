import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function SVG(props) {
    const classes = classnames(`svg-wrapper__${props.name}`, props.className);
    return (
        <div
            onClick={props.iconClickHandler}
            className={classes}
            dangerouslySetInnerHTML={{__html: props.svg}}
        />
    );
}

SVG.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    svg: PropTypes.string.isRequired,
    iconClickHandler: PropTypes.func
};

export {SVG};
