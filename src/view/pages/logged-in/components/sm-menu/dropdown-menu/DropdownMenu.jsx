import React from 'react';
import {Dropdown} from 'antd';
import {useHistory} from 'react-router-dom';
import {SMButton, SMIcon, SMMenu} from 'src/view/components';
import {dropdownMenuItems} from './dropdownMenuItems';
import {SMUserBar} from 'src/view/pages/logged-in/components/SMUserBar';
import {onMenuItemSelect} from '../';
import {useDispatch} from "react-redux";

export function DropdownMenu({SMuser}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const onSelect = onMenuItemSelect(history, dispatch);

    return (
        <Dropdown
            trigger={['click']}
            overlay={
                <SMMenu
                    className="sm-dropdown-menu"
                    type={'dropdown'}
                    items={dropdownMenuItems}
                    onClick={onSelect}
                />
            }
        >
            <SMButton className="ant-dropdown-link">
                <SMUserBar
                    firstName={SMuser.firstName}
                    lastName={SMuser.lastName}
                    size={SMuser.size}
                    onClick={e => e.preventDefault()}
                />
                <SMIcon
                    className="sm-icon-fill-grey"
                    iconType="fas"
                    icon="caret-down"
                />
            </SMButton>
        </Dropdown>
    );
}