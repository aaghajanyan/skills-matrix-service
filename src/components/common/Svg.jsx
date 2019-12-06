import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Svg(props) {
    const classes = classnames(`svg-wrapper__${props.name}`, props.className);
    return (
        <div
            className={classes}
            dangerouslySetInnerHTML={{__html: props.svg}}
        />
    );
}

Svg.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    svg: PropTypes.string.isRequired
};

export default Svg;
export {Svg};