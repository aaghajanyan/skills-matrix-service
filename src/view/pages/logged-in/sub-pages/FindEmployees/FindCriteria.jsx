import React, { useState } from 'react';
import { Select, Row, Col, Button} from 'antd';

import { CRITERIA } from '../../../../../configSearch/criteria';

const { Option } = Select

function FindCriteria(props){

    const [criteriaValue, setCriteriaValue] = useState();
    const { getFieldDecorator, getFieldsValue } = props.form;

    const handleSelect = (val) => {
        setCriteriaValue(val);
    }

    const handleClickChangeOption = () => {
      props.update(getFieldsValue(), props.criteriaId);
    }

    const handleDeleteRow = () => {
      props.delete(props.criteriaId);
    };

    const renderSelects = () => {

          return criteriaValue && Object.values(CRITERIA[criteriaValue]).map((item, index) => {
            return (<Col key={index} span={4}>
              {getFieldDecorator(`${props.criteriaId}[${item.key}]`)(
                  <Select placeholder={item.name} onSelect={handleClickChangeOption} key={item.name} >
                    {Object.values(item.items).map((items, indexSel) => (
                        <Option key={items.name}>{items.name}</Option>
                    ))}
                  </Select>)}
            </Col>)
          })
    }

    return (
        <Row className="rule-rows">
            <Col span={5}>
            {getFieldDecorator(`${props.criteriaId}[type]`)(
                <Select placeholder="Criteria" onSelect={handleSelect}>
                    {Object.keys(CRITERIA).map((item, index) => {
                        return <Option key={item}>{item}</Option>
                    })}
                </Select>)}
            </Col>
            {renderSelects()}
            <Col className="del_btn_right" span={1}>
                <Button className={`delBtn  ${props.className}`} onClick={handleDeleteRow} icon="delete"></Button>
            </Col>
        </Row>
    )
}

export {FindCriteria};