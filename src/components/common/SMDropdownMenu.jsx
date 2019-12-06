import React from 'react';
import { Dropdown } from 'antd';
import { SMSiderMenu } from '../common/SMSiderMenu/SMSiderMenu';
import { SMButton } from './Forms/SMButton/SMButton';
// import { SMIcon } from './SMIcon/SMIcon';
import { SMIconLink } from './SMIconLink/SMIconLink';
// import { Svg } from './Svg';
// import { SvgIcons } from './SvgIcons';
// import classNames from 'classnames';

function SMDropdownMenu(props) {
    return (
        <Dropdown overlay={<SMSiderMenu type={'dropdown'} items={props.menu}/>} trigger={['click']}>
            <SMButton className="ant-dropdown-link">
            {/* <Svg name={'arrowDownIcon'}
                svg={SvgIcons['arrowDownIcon']}
                // className={classes}
            /> */}
                <SMIconLink parentType={props.type} iconSrc={'arrowDownIcon'} title={props.title} href={props.href}/>
            </SMButton>
        </Dropdown>
    );
  };

  export { SMDropdownMenu };