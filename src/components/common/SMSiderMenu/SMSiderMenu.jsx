
import React from 'react';
import { SMMenu } from '../SMMenu/SMMenu';
import classNames from 'classnames';


function SMSiderMenu(props) {
    const siderStyle = props.type === 'sider' ? 'sm-menu-container' : '';
    const classes = classNames(
        props.className,
        siderStyle ,
      );

      return (
        <SMMenu
            type={props.type || undefined}
            defaultSelectedKeys={['']}
            mode={props.mode || ''}
            theme={props.theme || ''}
            className={classes}
            items={props.items}
        >

        </SMMenu>
      );
  }
  
  export { SMSiderMenu };
  