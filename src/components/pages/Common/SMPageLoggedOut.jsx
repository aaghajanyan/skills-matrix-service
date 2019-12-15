import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import { SMHeader } from 'components/common/SMHeader';
import logo from 'assets/images/logo.png';
import { authService } from 'client/lib/AuthService';
import { Redirect } from 'react-router-dom';
import { SMButton } from 'components/common/SMButton/SMButton';
import { RegisterForm } from 'pages/Register/RegisterForm';
import { LoginForm } from 'pages/Login/LoginForm';
const { Header, Content, Footer } = Layout;

function SMPageLoggedOut(props) {

    const isLoggedIn = authService.isLoggedIn();

    const [location, setLocation] = useState(props.match.path);

    return isLoggedIn ? (
        <Redirect to="/" />
    ) : (
        <Layout className="sm-layout">
            <Header className="sm-layout-header">
                <SMHeader title="Instigate Mobile - Skills Matrix" />
            </Header>
            <Content className="sm-content">
                <Row className="sm-content-row" type="flex" justify="center">
                    <Col xs={22} sm={18} md={12} lg={10} xl={8} xxl={6}>
                        <div className="sm-form-container">
                            <img
                                className="sm-instigate-logo"
                                src={logo}
                                alt="instigate mobile logo"
                            />
                            {location === '/login' ? <LoginForm {...props} /> :
                            <RegisterForm setLocation={setLocation} {...props}/>}
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer className="sm-footer">
                <SMButton
                    id="sm-footer-btn"
                    type="link"
                    target="_blank"
                    href="https://ggg.instigatemobile.com/"
                    children="ggg.instigatemobile.com"
                />
            </Footer>
        </Layout>
    );
}

export { SMPageLoggedOut };
