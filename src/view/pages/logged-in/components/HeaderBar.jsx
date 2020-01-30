import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {useSelector} from 'react-redux';

import {SMButton, SMIcon, SMInput} from 'src/view/components';
import {DropDownUserBar} from 'src/view/pages/logged-in/components/DropDownUserBar';


function HeaderBar(props) {

    const currentUser = useSelector(state => state.user);

    const [isSiderMenuIconCollapsed, setIsSiderMenuIconCollapsed] = useState(false);

    const toggleSiderMenu = () => {
        setIsSiderMenuIconCollapsed(!isSiderMenuIconCollapsed);
        props.collapseSideBar();
    };

    return (
        <div className={props.className}>
            <div className="sm-layout-container_header-bar-col-1">
                <SMButton
                    className="sider-container_collapse-btn"
                    type=""
                    onClick={toggleSiderMenu}
                >
                    <div>
                        <SMIcon
                            icon={isSiderMenuIconCollapsed ? 'list' : 'ellipsis-v'}
                            className="sm-icon-fill-light"
                        />
                    </div>
                </SMButton>
                <SMInput
                    className="sider-container_search-btn"
                    prefix={
                        <SMIcon
                            className="sm-icon-fill-grey"
                            iconType="fas"
                            icon="search"
                        />
                    }
                    placeholder="Search data"
                />

            </div>
            {
                (currentUser && <DropDownUserBar
                    className="sm-layout-container_header-bar-col-2"
                    firstName={ currentUser.fname }
                    lastName={ currentUser.lname }
                    size={'small'}
                />)
            }
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

export {HeaderBar};
