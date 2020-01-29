import React, {useState, useLayoutEffect } from 'react';
import {Layout} from 'antd';
import {HeaderBar, SideMenu} from './components';
import {SMLogo} from 'src/view/components'
import {sideMenuItems} from './components/sm-menu/side-menu/sideMenuItems';

const { Header, Sider, Content } = Layout;

function SMPageLoggedIn(props) {

    const [collapsed, setCollapsed] = useState(false);

    const collapseSideBar = () => {
        setCollapsed(!collapsed);
    }

    useLayoutEffect(() => {
        const updateSize = () => {
            if(window.innerWidth < 1100){
                setCollapsed(!collapsed);
            }else{
                setCollapsed(collapsed);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <React.Fragment>
            <Layout className='sm-layout-container'>
                <Sider
                    width="300"
                    collapsedWidth="100"
                    className='sider-container sm-sider'
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <SMLogo isCollapsed={collapsed} title="Skill Matrix" />
                    <SideMenu isCollapsed={collapsed} type='sider' mode={'inline'} theme={'dark'} items={sideMenuItems} />
                </Sider>
                <Layout>
                    <Header className='sm-layout-container_header'>
                        <HeaderBar
                            className='sm-layout-container_header-bar'
                            collapseSideBar={collapseSideBar}
                        />
                    </Header>
                    <Content className="sm-page-content" justify="center">
                        {props.content}
                    </Content>
                </Layout>
            </Layout>
        </React.Fragment>
    );
}

export { SMPageLoggedIn };
