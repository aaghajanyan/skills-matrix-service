import React from 'react';
import { Dropdown } from 'antd';
import { SMSiderMenu } from '../../../common/SMSiderMenu/SMSiderMenu';
import { SMButton } from '../../../common/SMButton/SMButton';
import { Svg } from '../../../common/Svg';
import { SvgIcons } from '../../../common/SvgIcons';
import PropTypes from 'prop-types';

function SMDropdownMenu(props) {
    return (
        <Dropdown overlay={<SMSiderMenu type={'dropdown'} items={props.menu}/>} trigger={['click']}>
            <SMButton className="ant-dropdown-link">
                <Svg name={'arrowDownIcon'} svg={SvgIcons['arrowDownIcon']} />
            </SMButton>
        </Dropdown>
    );
  };

SMDropdownMenu.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        href: PropTypes.string,
        className: PropTypes.string,
        iconSrc: PropTypes.string
    }))
};

export { SMDropdownMenu };