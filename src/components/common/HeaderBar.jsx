import React, { useState } from 'react';
import { SMButton } from '../common/SMButton/SMButton';
import { SMDropdownMenu } from '../common/SMDropdownMenu';
import { Input } from 'antd';
import { SMIconLink } from './SMIconLink/SMIconLink';
import { Svg } from './Svg';
import { SvgIcons } from './SvgIcons';
import PropTypes from 'prop-types';
import { SMUserBar } from 'components/common/SMUserBar/SMUserBar';
function HeaderBar(props) {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchData, setSearchData] = useState('');
    const iconClickHandler = (e) => {
        console.log("searchedValue: ", searchData);
    }
    const onChange = (e) => {
        setSearchData(e.target.value);
    }

    return (
        <div className={props.className}>
            <div className="sm-layout-container_header-bar-col-1">
                <SMButton className='sider-container_collapse-btn' type="" onClick={() => {
                    setIsCollapsed(!isCollapsed)
                    props.collapseSideBar()
                }}>
                    <SMIconLink parentType={props.type} iconSrc={isCollapsed ? 'hideSider' : 'openSider'}
                        className='sider-container_collapsed-icon'
                        title={props.title} href={'#'} />
                </SMButton>

                <Input onChange={onChange} className='sider-container_search-btn'
                    prefix={<Svg className='search-icon' name={'search'} svg={SvgIcons['search']} iconClickHandler={iconClickHandler} />}
                    placeholder="Search data" />
            </div>

            <div className="sm-layout-container_header-bar-col-2">
                <SMUserBar
                    className='home_tabs-header-user-bar'
                    firstName='Admin'
                    lastName='Admin'
                    colorCode={15551}
                    size={'medium'} />
                <SMDropdownMenu key="ant-dropdown-link" menu={props.menu} />
            </div>
        </div>
    );
}

HeaderBar.propTypes = {
    collapseSideBar: PropTypes.func,
    avatarSrc: PropTypes.string,
    subTitle: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        disabled: PropTypes.string,
        title: PropTypes.string,
        href: PropTypes.string,
        className: PropTypes.string,
        iconSrc: PropTypes.string
    }))
};

export { HeaderBar };
