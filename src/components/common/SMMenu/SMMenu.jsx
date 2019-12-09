import React from 'react';
import { Menu } from 'antd';
import { SMMenuItem } from '../SMMenuItem/SMMenuItem';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/instigate.svg';

function SMMenu(props) {
    const renderFormItems = () => {
        return props.items.map((item) => {
            return (
                <SMMenuItem
                    key = { item.props.title }
                    disabled = { item.props.disabled }
                    title = {item.props.title}
                    className = { item.props.className}
                    icon = {item.props.icon}
                    onClick={() => console.log("clicked")}
                >
                    {item.props.title === 'Skills Matrix' && <img src={logo} alt="instigate mobile logo" />}
                    {item.props.icon}
                    <span className='sm-menu-container_title'> {item.props.title} </span>
                    <Link to={item.props.href}></Link>
                </SMMenuItem>
            );
        });
    };

    return(
        <Menu
            key={props.key || undefined}
            type={props.type || undefined}
            defaultSelectedKeys={props.defaultSelectedKeys || []}
            defaultOpenKeys={props.defaultOpenKeys || []}
            mode={props.mode || undefined}
            theme={props.theme || undefined}
            className={props.className || undefined}
        >
            {renderFormItems()}
        </Menu>
    );
}

export { SMMenu };