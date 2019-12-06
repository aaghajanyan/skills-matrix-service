import React, { Component } from 'react';
import { Layout } from 'antd';
import { SMSiderMenu } from '../common/SMSiderMenu/SMSiderMenu';
import { HeaderBar } from '../common/HeaderBar';
import { siderMenuItems } from '../common/SMSiderMenu/SiderMenuItems';

const { Header, Sider, Content } = Layout;

class Home extends Component {

    constructor(props) {
        super(props);
        this.collapseSideBar = this.collapseSideBar.bind(this);
    }
    state = {
        collapsed: false,
    }
    
    collapseSideBar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <Layout className='layout-container'>
                <Sider width="300" collapsedWidth="100"
                     className='sider-container' trigger={null} collapsible collapsed={this.state.collapsed} 
                    //  onCollapse={(collapsed, type) => {
                    //     console.log(collapsed, type);
                    //   }}
                    >
                    <div className="logo sider-container_logo" />
                    <SMSiderMenu isCollapsed={this.state.collapsed} type='sider' mode={'inline'} theme={'dark'} items={siderMenuItems}/>
                </Sider>
                <Layout>
                    <Header className='layout-container_header' style={{ background: '#fff', padding: 0 }}>
                        <HeaderBar collapseSideBar={this.collapseSideBar}/>
                    </Header>
                    <Content>Content</Content>
                </Layout>
            </Layout>
        );
    }
}

export { Home };
