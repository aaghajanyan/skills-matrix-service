import React, { useState } from 'react';
import { Layout } from 'antd';
import { SMSiderMenu } from 'components/common/SMSiderMenu/SMSiderMenu';
import { HeaderBar } from 'components/common/HeaderBar';
import { siderMenuItems } from 'components/common/SMSiderMenu/SiderMenuItems';
import { headerMenuItems } from 'components/common/SMSiderMenu/HeaderMenuItems';

const { Header, Sider, Content } = Layout;

function SMPage(props) {

    const [collapsed, setCollapsed] = useState(false)

    const collapseSideBar = () => {
        setCollapsed(!collapsed)
    }

    return (
        <React.Fragment>
        <Layout className='layout-container'>
            <Sider width="300" collapsedWidth="100"
                 className='sider-container' trigger={null} collapsible collapsed={collapsed}>
                <div className="logo sider-container_logo" />
                <SMSiderMenu isCollapsed={collapsed} type='sider' mode={'inline'} theme={'dark'} items={siderMenuItems}/>
            </Sider>
            <Layout>
                <Header className='layout-container_header' style={{ background: '#fff', padding: 0 }}>
                    <HeaderBar
                        collapseSideBar={collapseSideBar}
                        avatarSrc={'data:image/png;base64,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'}
                        subTitle='Name Surname'
                        menu={headerMenuItems}/>
                </Header>
                <Content className="sm-page-content" justify="center">
                    {props.content}
                </Content>
            </Layout>
        </Layout>
        </React.Fragment>
    );
}

export { SMPage };
