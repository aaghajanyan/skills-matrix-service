import {logOut} from 'src/services/authService';

export const onMenuItemSelect = (history, dispatch) => ({item, key}) => {
    const {href} = item.props;
    key === 'logOut' && logOut(dispatch);

    if(item.props.href !== history.location.pathname){
        history.push(href);
    }
};


export {DropdownMenu} from './dropdown-menu/DropdownMenu';
export {SideMenu} from './side-menu/SideMenu';