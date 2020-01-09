import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import { withRouter } from "react-router-dom"
import { SMButton, SMIcon, SMMenu } from 'view/components';
import { dropdownMenuItems } from "./dropdownMenuItems"
import { logOut } from 'client/lib/authService';

function DropdownMenuInitial(props) {

    const handleSelect = ({ item, key }) => {
        const { href } = item.props;
        key === 'logOut' && logOut();
        props.history.push(href)
    }

    return (
        <Dropdown overlay={
            <SMMenu
                selectable
                className='sm-dropdown-menu'
                type={'dropdown'}
                items={dropdownMenuItems}
                onSelect={handleSelect}
            />}
            trigger={['click']}>
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

DropdownMenuInitial.propTypes = {
    key: PropTypes.string,
};

const DropdownMenu = withRouter(DropdownMenuInitial)

export { DropdownMenu };