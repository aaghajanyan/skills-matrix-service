import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function SMSelect({className, options, initialValue, onChange, name, rules, placeholder}) {
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
        <Select
            className={className || undefined}
            initialValue={initialValue || undefined}
            onChange={onChange}
            name={name || undefined}
            rules={rules || undefined}
            placeholder={placeholder || undefined}
        >
            {renderOptions(options)}
        </Select>
    );
}

export { SMSelect };
