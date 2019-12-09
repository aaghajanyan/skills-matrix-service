import React from 'react';
import { Radio } from 'antd';

function SMRadio({ options, defaultValue, onChange, value }) {
    const renderOptions = options => {
        return options.map(option => {
            return (
                <Radio key={option.value} value={option.value}>
                    {option.label}
                </Radio>
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
        <Radio.Group
            value={value || undefined}
            defaultValue={defaultValue || undefined}
            onChange={handleChange}
        >
            {renderOptions(options)}
        </Radio.Group>
    );
}

export { SMRadio };
