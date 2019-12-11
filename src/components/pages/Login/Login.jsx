import React from 'react';
import { LoginForm } from './LoginForm';
import { Layout, Row, Col } from 'antd';
import { SMHeader } from 'components/common/SMHeader';
import logo from 'assets/images/logo.png';
import { authService } from 'client/AuthService';
import { Redirect } from 'react-router-dom';
import { SMButton } from 'components/common/SMButton/SMButton';
const { Header, Content, Footer } = Layout;

function Login(props) {
    const isLoggedIn = authService.isLoggedIn();

    return isLoggedIn ? (
        <Redirect to="/" />
    ) : (
        <Layout className="login">
            <Header className="sm-layout-header">
                <SMHeader title="Instigate Mobile - Skills Matrix" />
            </Header>
            <Content className="login-content">
                <Row className="login-row-1" type="flex" justify="center">
                    <Col xs={22} sm={18} md={12} lg={10} xl={8} xxl={6}>
                        <div className="login-form-container">
                            <img
                                className="login-logo"
                                src={logo}
                                alt="instigate mobile logo"
                            />
                            <LoginForm
                                redirection={props.location.state || undefined}
                                span={6}
                            />
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer className="login-footer">
                <SMButton
                    id="login-footer-btn"
                    type="link"
                    target="_blank"
                    href="https://ggg.instigatemobile.com/"
                    children="ggg.instigatemobile.com"
                />
            </Footer>
        </Layout>
    );
}

export { Login };