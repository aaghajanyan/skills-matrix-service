import React from 'react';
import { Dropdown , Icon} from 'antd';
import { SMSiderMenu } from '../common/SMSiderMenu/SMSiderMenu';
import { SMButton } from './Forms/SMButton/SMButton';
import { SMIcon } from './SMIcon/SMIcon';

function SMDropdownMenu(props) {
    console.log(props.menu);
    return (
        <Dropdown overlay={<SMSiderMenu type={'dropdown'} items={props.menu}/>} trigger={['click']}>
            <SMButton className="ant-dropdown-link"> <SMIcon className='aaa' component='arrowDownIcon' type="down" /> </SMButton>
        </Dropdown>
    );
  };

  export { SMDropdownMenu };