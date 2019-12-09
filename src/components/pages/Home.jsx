import React, { Component } from 'react';
import { Layout } from 'antd';
import { SMSiderMenu } from 'components/common/SMSiderMenu';
import { SMButton } from 'components/common/SMButton/SMButton';
import { SMIcon } from 'components/common/SMIcon/SMIcon';

const { Header, Sider, Content } = Layout;

class Home extends Component {
    state = {
        collapsed: false,
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <Layout className='layout-container'>
                <Sider className='sider-container' trigger={null} collapsible collapsed={this.state.collapsed}
                    style={{ minWidth: '300', flex: '0 0 300', maxWidth: '400', width: '250', fontSize: '16px'}} >
                    <div className="logo sider-container_logo" />
                        <SMSiderMenu/>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <SMButton className='sider-container_collapse-btn' type="" onClick={this.toggle} >
                            <SMIcon type='' component={this.state.collapsed ? 'hideSider' : 'openSider'}/>
                            {/* {this.state.collapsed ? 'menu-unfold' : 'menu-fold'} /> */}
                        </SMButton>
                    </Header>
                    <Content>Content</Content>
                </Layout>
            </Layout>

                );
            }
}

export { Home };
