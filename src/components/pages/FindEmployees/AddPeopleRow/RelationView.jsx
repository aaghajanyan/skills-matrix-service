import React from 'react';
import { Row, Col, Select } from 'antd';

const { Option } = Select;

function RelationView(props){

    return (
        props.rowIndex > 0 && <Row gutter={16} >
        <Col span={4}>
            <Col className="label_select"><span>Relation</span></Col>
            {props.formItem.getFieldDecorator(`${props.cellData.id}[relCondition]`, { initialValue: "And" })(
                <Select disabled>
                    <Option value="And">And</Option>
                    <Option value="Or">Or</Option>
                </Select>
            )}
        </Col>
    </Row>
    )
}

export {RelationView}