
import React from 'react';
import { SMMenu } from './SMMenu/SMMenu';
import { siderMenuItems } from './SiderMenuItems'

function SMSiderMenu(props) {
    return (
        <SMMenu
            defaultSelectedKeys={['']}
            mode="inline"
            theme="dark"
            className='sm-menu-container'
            items={siderMenuItems}
        >

        </SMMenu>
    );
}

export { SMSiderMenu };
