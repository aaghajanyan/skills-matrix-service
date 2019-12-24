import React from 'react';
import { Row, Col, Select, Button } from 'antd';
import {Criteria} from '../Criteria';

const { Option } = Select;

function SelectRowView(props){

    const handleClick = (e) => {
        props.selectCriteriaValue(e);
        props.rowSelect(e)
    }

    const onDelEvent = () => {
        props.onRowDel(props.rowIndex);
    }

    return (
        <Row gutter={16} >
            <Col span={5}>
                <>
                <Col className="label_select"><span>Criteria</span></Col>
                {props.formItem.getFieldDecorator(`${props.cellData.id}[type]`)(
                        <Select
                        placeholder="Criteria"
                        onSelect={handleClick}
                    >
                        {Object.values(Criteria()).map((item, index) =>
                            <Option key={index} value={item.name}>{item.name}</Option>
                        )}
                    </Select>
                )}
                </>
            </Col>
            <Col span={18}>
                <Row gutter={16}>
                    {props.addSelectField(props.rowIndex, props.cellData.criteriaValue)}
                    {props.rowIndex > 0 && <Button className="delBtn" onClick={onDelEvent} icon="close"></Button>}
                </Row>
            </Col>
        </Row>
    )
}

export {SelectRowView}
