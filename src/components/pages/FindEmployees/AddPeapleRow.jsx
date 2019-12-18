import React from 'react';
import { Row, Col, Select, Button } from 'antd';
import {CRITERIA} from 'config/crieterias';

const { Option } = Select;

function AddPeapleRow (props) {

    const onDelEvent = () => {
        props.onRowDel(props.rows);
    }
    
    const handleClick = (e) => {
        props.rowSelect(e)
    }


    return(
        props.criteriaValue && <>
        <Row gutter={16} >
            <Col span={2}>
                {props.form.getFieldDecorator(`${props.cellData.id}[relation]`, {
                       initialValue: "And",
                    })(
                <Select >
                    <Option value="And">And</Option>
                    <Option value="Or">Or</Option>
                </Select>
                )}
            </Col>
        </Row>
        <Row gutter={16} >
            <Col span={5}>
                <Select
                    placeholder="Criteria"
                    onSelect={handleClick}
                >
                    {Object.values(CRITERIA).map((item, index) => 
                        <Option key={index} value={item.name}>{item.name}</Option>
                    )}
                </Select>
            </Col>
            <Col span={18}>
                <Row gutter={16}>
                    {props.addSelectField(props.rowIndex1, props.cellData.criteriaValue)}
                    <Button className="delBtn" onClick={onDelEvent} icon="close"></Button>
                </Row>
            </Col>
        </Row>
        </>
       
    )
}

export {AddPeapleRow}