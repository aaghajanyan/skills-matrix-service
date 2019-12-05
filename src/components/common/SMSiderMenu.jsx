
import React from 'react';
import { SMIcon } from './SMIcon/SMIcon';
import { SMMenu } from './SMMenu/SMMenu';
import { SMMenuItem } from './SMMenuItem/SMMenuItem';

function SMSiderMenu(props) {
      return (
        <SMMenu
            defaultSelectedKeys={['']}
            mode="inline"
            theme="dark"
            className='sm-menu-container'
            items={[
                SMMenuItem({
                    key: 'home',
                    disabled: 'false',
                    title: 'Skills Matrix',
                    href: '#home',
                    className: 'sm-menu-container_item sm-menu-container_home',
                    icon: SMIcon({
                        type: '',
                        component: 'sm'
                    }),
                }),
                SMMenuItem({
                    key: '/my_summary',
                    disabled: 'false',
                    title: 'My Profile',
                    href: '#my_summary',
                    className: 'sm-menu-container_item sm-menu-container_summary',
                    icon: SMIcon({
                        type: '',
                        component: 'user'
                    }),
                }),
                SMMenuItem({
                    key: '/people',
                    disabled: 'false',
                    title: 'People',
                    href: '#people',
                    className: 'sm-menu-container_item sm-menu-container_people',
                    icon: SMIcon({
                        type: '',
                        component: 'users'
                    }),
                }),
                SMMenuItem({
                    key: '/people_finder',
                    disabled: 'false',
                    title: 'People Finder',
                    href: '#people_finder',
                    className: 'sm-menu-container_item sm-menu-container_people-finder',
                    icon: SMIcon({
                        type: '',
                        component:'peopleFinder'
                    }),
                }),
                SMMenuItem({
                    key: '/branches',
                    disabled: 'false',
                    title: 'Branches',
                    href: '#branches',
                    className: 'sm-menu-container_item sm-menu-container_branches',
                    icon: SMIcon({
                        type: '',
                        component:'branches'
                    }),
                }),
                SMMenuItem({
                    key: '/category',
                    disabled: 'false',
                    title: 'Category',
                    href: '#category',
                    className: 'sm-menu-container_item sm-menu-container_category',
                    icon: SMIcon({
                        type: '',
                        component:'categories'
                    }),
                }),
                SMMenuItem({
                    key: '/skills',
                    disabled: 'false',
                    title: 'Skills',
                    href: '#skills',
                    className: 'sm-menu-container_item sm-menu-container_skills',
                    icon: SMIcon({
                        type: '',
                        component:'skills'
                    }),
                }),
                SMMenuItem({
                    key: '/settings',
                    disabled: 'false',
                    title: 'Settings',
                    href: '#settings',
                    className: 'sm-menu-container_item sm-menu-container_settings',
                    icon: SMIcon({
                        type: '',
                        component:'settings'
                    }),
                }),
                SMMenuItem({
                    key: '/login',
                    disabled: 'false',
                    title: 'Sign Out',
                    href: '/login',
                    className: 'sm-menu-container_item sm-menu-container_signout',
                    icon: SMIcon({
                        type: '',
                        component:'signOut'
                    }),
                })
            ]}
        >

        </SMMenu>
      );
  }
  
  export { SMSiderMenu };
  