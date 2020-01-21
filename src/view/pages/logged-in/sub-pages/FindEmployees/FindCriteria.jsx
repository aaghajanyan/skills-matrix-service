import React, { useState } from 'react';
import { Select, Row, Col, Button} from 'antd';

import { CRITERIA } from '../../../../../configSearch/criteria';

const { Option } = Select

function FindCriteria(props){

    const [criteriaValue, setCriteriaValue] = useState(props.defaultProperties ? props.defaultProperties.properties.type : null);
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

    const conditionQuery = (item) => (
        item.key === "list" || item.key === "branch" ||  item.key === "position" ? "name" : item.key
    )

    const renderSelects = () => {

          return criteriaValue && Object.values(CRITERIA[criteriaValue]).map((item, index) => {
            return (<Col key={index} span={4}>
              {getFieldDecorator(`${props.criteriaId}[${conditionQuery(item)}]`,{initialValue: props.defaultProperties ? props.defaultProperties.properties[conditionQuery(item)] : null})(
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
            <Col {...props.content.contentRightSelect}>
            {getFieldDecorator(`${props.criteriaId}[type]`, {initialValue: criteriaValue})(
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