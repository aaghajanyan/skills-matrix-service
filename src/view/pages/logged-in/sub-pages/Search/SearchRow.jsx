import React, {useState} from 'react';
import {Select, Row, Col, Button} from 'antd';
import {SMIcon} from 'view/components/SMIcon';
import {CRITERIA} from '../../../../../configSearch/criteria';
import { DatePicker } from 'antd';

const dateFormat = 'YYYY/MM/DD';

const {Option} = Select;

function SearchRow(props) {

    const [criteriaValue, setCriteriaValue] = useState(props.defaultProperties ? props.defaultProperties.properties.type : null);
    const {getFieldDecorator, getFieldsValue} = props.form;

    const handleSelect = (val) => {
        setCriteriaValue(val);
    };

    const handleClickChangeOption = () => {
        props.update(getFieldsValue(), props.criteriaId);
    };

    const handleDeleteRow = () => {
        props.delete(props.criteriaId);
    };

    const conditionQuery = (item) => {
        return item.key === 'list' || item.key === 'branch' || item.key === 'position' ? 'name' : item.key
    };

    const initialValues = (item) => {
        return props.defaultProperties ? props.defaultProperties.properties[conditionQuery(item)] : item.name;
    };

    const renderSelects = () => {

        return criteriaValue && Object.values(CRITERIA[criteriaValue]).map((item, index) => {
            return  item.key === 'last_worked_date' ? <Col key={index} span={3}>
                {getFieldDecorator(`${props.criteriaId}[${conditionQuery(item)}]`,{initialValue: initialValues(item)})(
                    <DatePicker key={item.key} onChange={handleClickChangeOption} format={dateFormat} />
                )}
                </Col> : <Col key={index} span={3}>
                {getFieldDecorator(`${props.criteriaId}[${conditionQuery(item)}]`,{initialValue: initialValues(item)})(
                    <Select disabled={props.disabled} placeholder={item.name} onSelect={handleClickChangeOption} key={item.name} >
                        {Object.values(item.items).map((items, indexSel) => (
                            <Option key={items.name}>{items.name}</Option>
                        ))}
                    </Select>)}
            </Col>;
        });
    };

    return (
        <Row className="rule-rows">
            <Col {...props.content.contentRightSelect}>
                {getFieldDecorator(`${props.criteriaId}[type]`, {initialValue: criteriaValue})(
                    <Select disabled={props.disabled} placeholder="Criteria" onSelect={handleSelect}>
                        {Object.keys(CRITERIA).map((item, index) => {
                            return <Option key={item}>{item}</Option>;
                        })}
                    </Select>)}
            </Col>
            {renderSelects()}
            <Col className="del_btn_right" span={1}>
                <Button onClick={handleDeleteRow} className={`delBtn  ${props.className}`}>
                    <SMIcon iconType="far" icon="trash-alt" />
                </Button>
            </Col>
        </Row>
    );
}

export {SearchRow};