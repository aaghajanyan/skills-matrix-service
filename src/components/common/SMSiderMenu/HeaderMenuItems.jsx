import { SMMenuItem } from '../SMMenuItem/SMMenuItem';

const headerMenuItems = [
    SMMenuItem({
        key: "settings",
        disabled: "false",
        title: "Settings",
        href: "#settings",
        className: "",
        
    }),
    SMMenuItem({
        key: "signOut",
        disabled: "false",
        title: "Sign Out",
        href: "/login",
        className: "",
        
    })
];

export { headerMenuItems };
