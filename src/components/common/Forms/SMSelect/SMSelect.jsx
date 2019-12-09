import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function SMSelect({ options, defaultValue, onChange, value }) {
    const renderOptions = options => {
        return options.map(option => {
            return (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            );
        });
    };

    const handleChange = e => {
        if (e) {
            onChange(e.target.value);
            e.stopPropagation();
        }
    };

    return (
        <Select
            value={value || undefined}
            defaultValue={defaultValue || undefined}
            onChange={handleChange}
        >
            {renderOptions(options)}
        </Select>
    );
}

export { SMSelect };
