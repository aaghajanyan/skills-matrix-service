import React from 'react';
import { LoginForm } from './LoginForm'
import { Layout, Row, Col } from 'antd';
import { SMHeader } from '../../common/SMHeader'
import logo from '../../../assets/images/logo.png';
const { Header, Content } = Layout;

function Login(props) {
    return (
        <Layout className="login">
            <Header>
                <SMHeader title="Instigate Mobile - Skills Matrix"/>
            </Header>
            <Content className="login-content">
                <Row className="login-row-1" type="flex" justify="center">
                    <Col xs={22} sm={18} md={12} lg={10} xl={8} xxl={6}>
                        <div className="login-form-container">
                            <img className="login-logo" src={logo} alt="instigate mobile logo"/>
                            <LoginForm span={6}/>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export { Login };