import React, { useState } from 'react';
import { SMButton } from '../common/Forms/SMButton/SMButton';
import { SMDropdownMenu } from '../common/SMDropdownMenu';
import { PageHeader } from 'antd';
import { Input } from 'antd';
import { SMIconLink } from './SMIconLink/SMIconLink';
import { Svg } from './Svg';
import { SvgIcons } from './SvgIcons';
import PropTypes from 'prop-types';

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
        <React.Fragment>
            <SMButton className='sider-container_collapse-btn' type="" onClick={() => {
                setIsCollapsed(!isCollapsed)
                props.collapseSideBar()
            }}>
                <SMIconLink parentType={props.type} iconSrc={isCollapsed ? 'hideSider' : 'openSider'} 
                    title={props.title} href={props.href}/>
            </SMButton>

            <Input onChange={onChange} className='sider-container_search-btn' 
                prefix={<Svg className='search-icon' name={'search'} svg={SvgIcons['search']} iconClickHandler={iconClickHandler} />} 
                placeholder="Search data"/>

            <PageHeader
                className='layout-container_page-header'
                subTitle={props.subTitle}
                extra={[ <SMDropdownMenu key="ant-dropdown-link" menu={props.menu}/>]}
                avatar={{ src: props.avatarSrc }}
            >

            </PageHeader>
        </React.Fragment>
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
