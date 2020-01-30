import React from 'react';
import {Redirect, Route, useHistory} from 'react-router-dom';

import {Col, Layout, Row} from 'antd';

import logo from 'src/assets/images/logo.png';

import {isLoggedIn} from 'src/services/authService';
import {RegisterForm} from 'src/view/pages/logged-out/RegisterForm';
import {LoginForm} from 'src/view/pages/logged-out/LoginForm';
import {SMButton} from 'src/view/components';
import {ForgotPasswordConfirmation} from './forgot-password/ForgotPasswordConfirmationForm';
import {ForgotPasswordSendForm} from './forgot-password/ForgotPasswordSendForm';
import {SMConfig} from '../../../config';

const {Header, Content, Footer} = Layout;

function SMPageLoggedOut() {

    const loggedIn = isLoggedIn();

    const history = useHistory();

    return loggedIn ? (
        <Redirect to="/" />
    ) : (
        <Layout className="sm-layout">
            <Header className="sm-layout-header">
                <span className="sm-header-title"> Instigate Mobile - Skills Matrix </span>
            </Header>
            <Content className="sm-main-content">
                <Row className="sm-content-row" type="flex" justify="center">
                    <Col xs={22} sm={18} md={12} lg={10} xl={8} xxl={6}>
                        <div className="sm-form-container">
                            <img
                                className="sm-instigate-logo"
                                src={logo}
                                alt="instigate mobile logo"
                            />
                            <Route exact path={SMConfig.routes.login} render={ () => <LoginForm successEndpoint={history.location.state ? history.location.state.url: SMConfig.routes.home}/>} />
                            <Route exact path={SMConfig.routes.forgotPassword} component={ForgotPasswordSendForm} />
                            <Route exact path={`${SMConfig.routes.forgotPassword}/change/:token`} component={ForgotPasswordConfirmation} />
                            <Route exact path={`${SMConfig.routes.registration}/:token`} component={RegisterForm} />
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer className="sm-footer">
                <SMButton
                    className="sm-link"
                    type="link"
                    target="_blank"
                    href="https://ggg.instigatemobile.com/"
                    children="ggg.instigatemobile.com"
                />
            </Footer>
        </Layout>
    );
}

export {SMPageLoggedOut};
