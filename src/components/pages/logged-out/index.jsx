import React from 'react';
import { Layout, Row, Col } from 'antd';
import logo from 'assets/images/logo.png';
import { authService } from 'client/lib/AuthService';
import { Redirect } from 'react-router-dom';
import { SMButton } from 'components/common/SMButton/SMButton';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
const { Header, Content, Footer } = Layout;

function SMPageLoggedOut(props) {

    const isLoggedIn = authService.isLoggedIn();

    const location = props.match.path;

    return isLoggedIn ? (
        <Redirect to="/" />
    ) : (
        <Layout className="sm-layout">
            <Header className="sm-layout-header">
                <img className="sm-header-icon" src={logo} alt="instigate mobile logo"/>
                <span className="sm-header-title"> Instigate Mobile - Skills Matrix </span>
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
                            {location === '/login' ? <LoginForm {...props} /> : <RegisterForm {...props}/>}
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer className="sm-footer">
                <SMButton
                    className='sm-link'
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
