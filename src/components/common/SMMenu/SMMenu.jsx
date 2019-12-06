import React from 'react';
import { Menu } from 'antd';
import { SMMenuItem } from '../SMMenuItem/SMMenuItem';
import { SMIconLink } from '../SMIconLink/SMIconLink';
// import { Svg } from '../Svg';
// import { SvgIcons } from '../SvgIcons';
// import classNames from 'classnames';

function SMMenu(props) {

    const renderFormItems = () => {
        return props.items.map((item) => {
            return (
                <SMMenuItem
                    key = { item.title }
                    disabled = { item.disabled }
                    title = {item.title}
                    className = { item.className}
                    // iconSrc = {item.props.iconSrc}
                    type={'sider'}
                >
                    {/* <Svg name={item.iconSrc}
                        svg={SvgIcons[item.iconSrc]}
                // className={classes}
                    /> */}
                    <SMIconLink parentType={props.type} iconSrc={item.iconSrc} title={item.title} href={item.href}/>
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