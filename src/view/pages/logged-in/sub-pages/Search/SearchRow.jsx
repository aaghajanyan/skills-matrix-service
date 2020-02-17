import React, {useState} from 'react';
import {Select, Row, Col, Button} from 'antd';
import {SMIcon} from 'view/components/SMIcon';
import {CRITERIA} from '../../../../../configSearch/criteria';
import { DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
const datePlaceholder = 'Select date';

const {Option} = Select;

function SearchRow(props) {

    const [criteriaValue, setCriteriaValue] = useState(props.defaultProperties ? props.defaultProperties.properties.type : null);
    const {getFieldDecorator, getFieldsValue} = props.form;
    const [visibleField, setVisiblefield] = useState(false);
    const [dateIsChecked, setDateIsChecked] =useState(false);
    const [valueDate,setDatePicker] = useState();

    const handleSelect = (val) => {
        if(Object.values(CRITERIA[val]).length > 2 ){
            setVisiblefield(true)
        }
        setCriteriaValue(val);
    };

    const SelectVisible =  (item) => {
            if(getFieldsValue()[props.criteriaId]) {
                if (visibleField) {
                    if(getFieldsValue()[props.criteriaId].name !== undefined && getFieldsValue()[props.criteriaId]['opCondition'] !== undefined) {
                        return 'visible';
                    } else if (item && (item.key === 'opCondition' || item.key === 'list')) {
                        return 'visible';
                    } else {
                        return 'hidden';
                    }
                } else {
                    return 'visible';
                }
            }
            return 'hidden';
    };

    const handleClickChangeOption = () => {
        const values = getFieldsValue();
        if(valueDate){
            values[props.criteriaId]['last_worked_date'] = valueDate;
        }
        props.update(values, props.criteriaId);
    };

    const handleClickChangeDate = (e, dateString) => {
        const values = getFieldsValue();
        setDatePicker(dateString);
        setDateIsChecked(true);
        values[props.criteriaId]['last_worked_date'] = dateString;
        props.update(values, props.criteriaId);
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
                {getFieldDecorator(`${props.criteriaId}[${conditionQuery(item)}]`,{initialValue: initialValues(item) ? moment(initialValues(item)) : null}) (
                    <DatePicker style={{visibility: SelectVisible(item)}} disabled={props.disabled} placeholder={datePlaceholder} key={item.key} format={dateFormat} onChange={handleClickChangeDate}/>
                )}
                </Col> : <Col key={index} span={3}>
                {getFieldDecorator(`${props.criteriaId}[${conditionQuery(item)}]`,{initialValue: initialValues(item)})(
                    <Select style={{visibility: SelectVisible(item)}} disabled={props.disabled} placeholder={item.name} onSelect={handleClickChangeOption} key={item.name} >
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