import React from 'react';
import {Col, Layout, Row} from 'antd';
import not_found_404 from 'src/assets/images/404.png';
import logo from 'src/assets/images/instigate.svg';

const { Header, Content } = Layout;

function NotFound() {
    return (
        <Layout className="page-not-found">
            <Header className="sm-layout-header">
                <img className="sm-header-icon" src={logo} alt="instigate mobile logo"/>
                <span className="sm-header-title"> Instigate Mobile - Skills Matrix </span>
            </Header>
            <Content className="page-not-found-content">
                <Row className="page-not-found-row-1" type="flex" justify="center">
                    <Col xs={22} sm={18} md={12} lg={10} xl={8} xxl={6} className="page-not-found-col">
                        <img className="page-not-found-img" src={not_found_404} alt="Not Found 404"/>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export { NotFound };