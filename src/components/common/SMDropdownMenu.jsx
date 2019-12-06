import React from 'react';
import { Dropdown } from 'antd';
import { SMSiderMenu } from '../common/SMSiderMenu/SMSiderMenu';
import { SMButton } from './Forms/SMButton/SMButton';
import { Svg } from './Svg';
import { SvgIcons } from './SvgIcons';
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
    key: PropTypes.string,
    menu: PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        href: PropTypes.string,
        className: PropTypes.string,
        iconSrc: PropTypes.string
    })
};

export { SMDropdownMenu };