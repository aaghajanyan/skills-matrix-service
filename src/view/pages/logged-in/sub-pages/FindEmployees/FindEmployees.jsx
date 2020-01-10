import React, { useState, useRef } from 'react';
import { Row, Form, Col, Icon, Select, Button } from 'antd';
import { PeopleRow } from './PeopleRow';
import { UserDataView } from './UserDataView/UserDataView';
import { SMUserBar } from '../../components/SMUserBar';
import { SMButton } from 'view/components';
import { useSelector, useDispatch } from 'react-redux';

import { CRITERIA } from '../../../../../configSearch/criteria';
import { getSearchParams, getUsers, searchParams } from 'store/actions/search';

const { Option } = Select;

function FindPeople(props) {
    const id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const [criteriaValue, setCriteriaValue] = useState("");
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [collapseFind, setCollapseFind] = useState(false);
    const [dataFields, setdataFields] = useState([
        {
            id: id
        }
    ]);

    const [rowIndex, setrowIndex] = useState()

    const refForScroll = useRef();

    const { getFieldDecorator, getFieldsValue, validateFields, resetFields } = props.form;

    const dispatch = useDispatch();

    const handleAddEvent = () => {
        const rows = {
            id: id,
        }

        setDisabledBtn(true);
        setdataFields(dataFields.concat(rows));
        dispatch(getSearchParams(searchParams.concat(rows)));
    }

    const usersData = useSelector((state) => {
        if (state.Search.items && state.Search.items.data) {
            state.Search.items.data = state.Search.items.data.map(item => {
                item.key = item.guid
                const colorCode = Math.floor(100000 + Math.random() * 900000);
                item.avatar = <SMUserBar
                    colorCode={colorCode}
                    firstName={item.fname}
                    lastName={item.lname}
                    size='medium'
                />
                return item;
            })

            return ({
                users: state.Search.items.data,
                fieldRows: state.Search.items.rows,
                fieldValues: state.Search.items.values,
                loading: state.Search.loading,
                error: state.Search.error
            })
        }


    });

    const handleRowDel = (rows) => {
        searchParams.splice(rows, 1);
        const delRow = [...searchParams];
        setdataFields(delRow);
        dispatch(getSearchParams(delRow));
    };

    const handleChange = () => {
        const fieldsValue = getFieldsValue();
        const fieldsRow = fieldsValue[rowIndex];
        if ((fieldsRow.opCondition) && (fieldsRow.proficiency || fieldsRow.list || fieldsRow.experince || fieldsRow.branch || fieldsRow.position)) {
            setDisabledBtn(false);
        }
        // dispatch(getUsers(fieldsValue));
    }

    const renderFields = (data, index) => {
        if (searchParams[index]) {
            setrowIndex(searchParams[index].id);
            return getFieldDecorator(`${searchParams[index].id}[${data.key}]`, { initialValue: usersData && usersData.fieldValues[searchParams[index].id] && usersData.fieldValues[searchParams[index].id][data.key] })(
                <Select key={index} placeholder={data.name} onSelect={handleChange}>
                    {data.items.map(item => <Option key={index} value={item.name}>{item.name}</Option>)}
                </Select>
            )
        } else {
            return (
                <Select key={index} placeholder={data.name} onSelect={handleChange}>
                    {data.items.map(item => <Option key={index} value={item.name}>{item.name}</Option>)}
                </Select>
            )
        }
    }

    const addSelectField = (indexRow, criteriaVal) => (
        Object.values(CRITERIA).map((criteria) => {
            if (criteria.name !== criteriaVal) {
                return null;
            }

            return criteria.input.map((data, index) => {
                return (
                    <Col key={index} span={5}>
                        <Col className="label_select"><span>{data.name}</span></Col>
                        {renderFields(data, indexRow)}
                    </Col>
                )
            }
            )
        })
    );

    const handleResetFields = () => {
        resetFields();
        dispatch(getSearchParams([{
            id: id
        }]));
        usersData.users = null;
        setdataFields([{
            id: id
        }]);
        setCriteriaValue();
        setDisabledBtn(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        refForScroll.current.scrollTo(0, 0);
        setCollapseFind(true);
        validateFields((err, values) => {
            if (!err) {
                dispatch(getUsers(values));
            }
        });
    }

    const collapsesOut = () => {
        setCollapseFind(false);
    }

    const selectCriteriaValue = (value) => {
        setCriteriaValue(value);
        return value;
    }

    return (
        <>
            <div ref={refForScroll} className={`main_container_people_finder ${collapseFind && "default_main_container"} `}>
                <Row className="people_finder_header">
                    <div><h1>Find people </h1></div>
                    <div> <SMButton className='sm-button skills-table-add-skill-button'>
                        Export AS
                </SMButton></div>
                </Row>
                <Row className={collapseFind ? "collapses_visible" : "collapses_hidden"}>
                    <Icon onClick={collapsesOut} type="double-right" />
                </Row>
                <Form onSubmit={handleSubmit}>
                    <Form.Item>
                        {searchParams.map((item, index) => <PeopleRow key={item.id}
                            onRowDel={handleRowDel}
                            rows={item}
                            rowIndex={index}
                            addSelectField={addSelectField}
                            criteriaValue={selectCriteriaValue}
                            formItem={props.form}
                            fieldsValue={usersData && usersData.fieldValues}
                        />)}
                    </Form.Item>
                    <Row>
                        <Button disabled={disabledBtn} onClick={handleAddEvent} icon="plus" className={(criteriaValue || (criteriaValue === undefined && searchParams.length > 1)) ? "" : "visible_info_desc"} id={disabledBtn ? "add_people_btn_disabled" : "add_people_btn_enabled"}>
                            Add more criteria
                    </Button>
                    </Row>

                    <Form.Item className={(criteriaValue || (criteriaValue === undefined && searchParams.length > 1)) ? "people_finder_buttons" : "visible_info_desc"}>
                        <Row gutter={16}>
                            <Col span={10}>
                                <Button type="primary" htmlType="submit" id="people_finder_btn">
                                    Find
                            </Button>
                            </Col>
                            <Col span={10}>
                                <Button onClick={handleResetFields} id="reset_people_btn"> Reset </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
                <Row type="flex" justify="center" className={(criteriaValue || (criteriaValue === undefined && searchParams.length > 1)) ? "visible_info_desc" : "main_info_desc"}>
                    <Col className="people_finder_info_desc">Please select the criteria to find employees</Col>
                </Row>
            </div>

            {usersData && usersData.users && <UserDataView userData={usersData.users} history={props.history} />}
        </>
    )
}

const FindEmployees = Form.create({ name: 'FindEmployees' })(FindPeople);
export { FindEmployees };