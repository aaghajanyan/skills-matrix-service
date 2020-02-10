import React from 'react';
import {Select} from 'antd';
import {PropTypes} from 'prop-types';

const {Option} = Select;

function SMSelect({options, ...restProps}) {

    function handleChange(value) {
        return restProps.onChange(value);
    }

    const renderOptions = options => {
        return options.map(option => {
            return (
                <Option key={option.value} value={option.value}>
                    {option.value}
                </Option>
            );
        });
    };

    return (
        <Select mode={restProps.mode} {...restProps} onChange={handleChange}>
            {renderOptions(options)}
        </Select>
    );
}

SMSelect.propTypes = {
    className: PropTypes.string,
    initialvalue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string
    })),
    mode: PropTypes.string
};


export {SMSelect};
