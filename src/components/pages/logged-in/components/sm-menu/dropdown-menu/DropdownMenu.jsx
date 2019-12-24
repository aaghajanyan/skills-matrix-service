import React from 'react';
import { Dropdown } from 'antd';
import { SideMenu } from '../side-menu/SideMenu';
import { SMButton } from 'components/common';
import { SVG } from 'assets/svg/SVG';
import { SVGIcons } from 'assets/svg/SVGIcons';
import PropTypes from 'prop-types';
import {dropdownMenuItems} from "./dropdownMenuItems"

function DropdownMenu(props) {
    return (
        <Dropdown overlay={<SideMenu type={'dropdown'} items={dropdownMenuItems}/>} trigger={['click']}>
            <SMButton className="ant-dropdown-link">
                <SVG name={'arrowDownIcon'} svg={SVGIcons['arrowDownIcon']} />
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
        iconSrc: PropTypes.string
    }))
};

export { DropdownMenu };