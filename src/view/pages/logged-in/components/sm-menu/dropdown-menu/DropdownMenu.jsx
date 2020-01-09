import React from 'react';
import { Dropdown } from 'antd';
import { SideMenu } from '../side-menu/SideMenu';
import { SMButton, SMIcon } from 'view/components';

import PropTypes from 'prop-types';
import {dropdownMenuItems} from "./dropdownMenuItems"

function DropdownMenu(props) {
    return (
        <Dropdown overlay={<SideMenu className='sm-dropdown-menu' type={'dropdown'} items={dropdownMenuItems}/>} trigger={['click']}>
            <SMButton className="ant-dropdown-link">
                <SMIcon
                    className='sm-icon-fill-grey'
                    iconType='fas'
                    icon='caret-down'
                />
            </SMButton>
        </Dropdown>
    );
  };

  DropdownMenu.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        href: PropTypes.string,
        className: PropTypes.string,
        icon: PropTypes.string
    }))
};

export { DropdownMenu };