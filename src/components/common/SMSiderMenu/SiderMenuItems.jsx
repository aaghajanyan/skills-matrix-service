
// import React from 'react';
import { SMIcon } from '../SMIcon/SMIcon';
import { SMMenuItem } from '../SMMenuItem/SMMenuItem';

const siderMenuItems = [
    SMMenuItem({
        key: "home",
        disabled: "false",
        title: "Skills Matrix",
        href: "#home",
        className: "sm-menu-container_item sm-menu-container_home",
        icon: SMIcon({
            type: "",
            component: "sm"
        })
    }),
    SMMenuItem({
        key: "/my_summary",
        disabled: "false",
        title: "My Profile",
        href: "#my_summary",
        className: "sm-menu-container_item sm-menu-container_summary",
        icon: SMIcon({
            type: "",
            component: "user"
        })
    }),
    SMMenuItem({
        key: "/people",
        disabled: "false",
        title: "People",
        href: "#people",
        className: "sm-menu-container_item sm-menu-container_people",
        icon: SMIcon({
            type: "",
            component: "users"
        })
    }),
    SMMenuItem({
        key: "/people_finder",
        disabled: "false",
        title: "People Finder",
        href: "#people_finder",
        className: "sm-menu-container_item sm-menu-container_people-finder",
        icon: SMIcon({
            type: "",
            component: "peopleFinder"
        })
    }),
    SMMenuItem({
        key: "/branches",
        disabled: "false",
        title: "Branches",
        href: "#branches",
        className: "sm-menu-container_item sm-menu-container_branches",
        icon: SMIcon({
            type: "",
            component: "branches"
        })
    }),
    SMMenuItem({
        key: "/category",
        disabled: "false",
        title: "Category",
        href: "#category",
        className: "sm-menu-container_item sm-menu-container_category",
        icon: SMIcon({
            type: "",
            component: "categories"
        })
    }),
    SMMenuItem({
        key: "/skills",
        disabled: "false",
        title: "Skills",
        href: "#skills",
        className: "sm-menu-container_item sm-menu-container_skills",
        icon: SMIcon({
            type: "",
            component: "skills"
        })
    }),
    SMMenuItem({
        key: "/settings",
        disabled: "false",
        title: "Settings",
        href: "#settings",
        className: "sm-menu-container_item sm-menu-container_settings",
        icon: SMIcon({
            type: "",
            component: "settings"
        })
    }),
    SMMenuItem({
        key: "/login",
        disabled: "false",
        title: "Sign Out",
        href: "/login",
        className: "sm-menu-container_item sm-menu-container_signout",
        icon: SMIcon({
            type: "",
            component: "signOut"
        })
    })
];

// const siderMenuItems = [
//     SMMenuItem({
//         key: "home",
//         disabled: "false",
//         title: "Skills Matrix",
//         href: "#home",
//         className: "sm-menu-container_item sm-menu-container_home",
//         iconName: 'user'
//     }),
//     SMMenuItem({
//         key: "/my_summary",
//         disabled: "false",
//         title: "My Profile",
//         href: "#my_summary",
//         className: "sm-menu-container_item sm-menu-container_summary",
//         iconName: 'users'

//     }),
//     SMMenuItem({
//         key: "/people",
//         disabled: "false",
//         title: "People",
//         href: "#people",
//         className: "sm-menu-container_item sm-menu-container_people",
//         iconName: 'people'

//     }),
//     SMMenuItem({
//         key: "/people_finder",
//         disabled: "false",
//         title: "People Finder",
//         href: "#people_finder",
//         className: "sm-menu-container_item sm-menu-container_people-finder",
//         iconName: 'peopleFinder'

//     }),
//     SMMenuItem({
//         key: "/branches",
//         disabled: "false",
//         title: "Branches",
//         href: "#branches",
//         className: "sm-menu-container_item sm-menu-container_branches",
//         iconName: 'branches'

//     }),
//     SMMenuItem({
//         key: "/category",
//         disabled: "false",
//         title: "Category",
//         href: "#category",
//         className: "sm-menu-container_item sm-menu-container_category",
//         iconName: 'categories'

//     }),
//     SMMenuItem({
//         key: "/skills",
//         disabled: "false",
//         title: "Skills",
//         href: "#skills",
//         className: "sm-menu-container_item sm-menu-container_skills",
//         iconName: 'skills'

//     }),
//     SMMenuItem({
//         key: "/settings",
//         disabled: "false",
//         title: "Settings",
//         href: "#settings",
//         className: "sm-menu-container_item sm-menu-container_settings",
//         iconName: 'settings'

//     }),
//     SMMenuItem({
//         key: "/login",
//         disabled: "false",
//         title: "Sign Out",
//         href: "/login",
//         className: "sm-menu-container_item sm-menu-container_signout",
//         iconName: 'signOut'

//     })
// ];

export { siderMenuItems };
