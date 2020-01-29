import React from 'react';
import {Dropdown} from 'antd';
import {useHistory} from "react-router-dom"
import {SMButton, SMIcon, SMMenu} from 'src/view/components';
import {dropdownMenuItems} from "./dropdownMenuItems"
import {onMenuItemSelect} from "../";

export function DropdownMenu({isVisible, onClick}) {

    const history = useHistory();

    const onSelect = onMenuItemSelect(history);

    return (
        <Dropdown
            visible={isVisible}
            onClick={onClick}
            overlay={
                <SMMenu
                    className='sm-dropdown-menu'
                    type={'dropdown'}
                    items={dropdownMenuItems}
                    onClick={onSelect}
                />
            }
        >
            <SMButton className="ant-dropdown-link">
                <SMIcon
                    className='sm-icon-fill-grey'
                    iconType='fas'
                    icon='caret-down'
                />
            </SMButton>
        </Dropdown>
    );
}