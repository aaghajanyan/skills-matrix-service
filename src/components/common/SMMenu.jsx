import React from 'react';
import { Menu } from 'antd';
import { SMIconLink } from './SMIconLink';
import PropTypes from 'prop-types';

function SMMenu(props) {

    const renderFormItems = () => {
        return props.items.map((item) => {
            return (
                <Menu.Item
                    key = { item.key }
                    title = {item.title}
                    className = {item.className}
                    href={item.href}
                    type={'sider'}
                >
                    <SMIconLink parentType={props.type} iconSrc={item.iconSrc} title={item.title}/>
                </Menu.Item>
            );
        });
    };

    return(
        <Menu {...props} >
            {renderFormItems()}
        </Menu>
    );
}

SMMenu.propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        keyPath: PropTypes.string,
        className: PropTypes.string,
        iconSrc: PropTypes.string
    })),
    defaultSelectedKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    mode: PropTypes.string,
    theme: PropTypes.string
};

export { SMMenu };