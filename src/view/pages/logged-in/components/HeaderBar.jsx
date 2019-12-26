import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu } from './sm-menu/dropdown-menu/DropdownMenu';
import { SMButton, SMInput, SMIcon } from 'view/components';
import { SMUserBar } from './SMUserBar';

function HeaderBar(props) {

    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={props.className}>
            <div className="sm-layout-container_header-bar-col-1">
                <SMButton
                    className='sider-container_collapse-btn'
                    type=""
                    onClick={() => {
                        setIsCollapsed(!isCollapsed)
                        props.collapseSideBar()
                    }}
                    >
                    <div>
                        <SMIcon
                            icon={isCollapsed ? 'list' : 'ellipsis-v'}
                            className='sm-icon-fill-light'
                        />
                    </div>
                </SMButton>

                <SMInput
                    className='sider-container_search-btn'
                    prefix={
                        <SMIcon
                            className='sm-icon-fill-grey'
                            iconType='fas'
                            icon='search'
                        />
                    }
                    placeholder="Search data"
                />

            </div>

            <div className="sm-layout-container_header-bar-col-2">
                <SMUserBar
                    firstName='Admin'
                    lastName='Admin'
                    colorCode={15551}
                    size={'medium'} />
                <DropdownMenu key="ant-dropdown-link" menu={props.menu} />
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
        icon: PropTypes.string
    }))
};

export { HeaderBar };
