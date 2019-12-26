import React from 'react';
import { Menu } from 'antd';
import { SMIconLink } from './SMIconLink';
import PropTypes from 'prop-types';

function SMMenu(props) {

    const renderMenuItems = () => {
        return props.items.map((item) => {
            return (
                <Menu.Item
                    key = { item.key }
                    title = {item.title}
                    className = {item.className}
                    href={item.href}
                    type={'sider'}
                >
                    <SMIconLink
                        className='sm-icon-light'
                        parentType={props.type}
                        icon={item.icon}
                        title={item.title}
                    />
                </Menu.Item>
            );
        });
    };

    return(
        <Menu {...props} >
            {renderMenuItems()}
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
        icon: PropTypes.string
    })),
    defaultSelectedKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    mode: PropTypes.string,
    theme: PropTypes.string
};

export { SMMenu };