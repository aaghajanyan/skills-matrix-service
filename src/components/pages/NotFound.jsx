import React from 'react';
import { Layout, Row, Col } from 'antd';
import { SMHeader } from 'components/common/SMHeader'
import not_found_404 from 'assets/images/404.png';
const { Header, Content } = Layout;

function NotFound(props) {
    return (
        <Layout className="page-not-found">
            <Header>
                <SMHeader title="Instigate Mobile - Skills Matrix"/>
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