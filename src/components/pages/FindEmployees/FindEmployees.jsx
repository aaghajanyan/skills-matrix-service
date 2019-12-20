import React, {useState, useRef} from 'react';
import { Row, Form, Col, Icon, Select, Button } from 'antd';
import { post } from 'client/lib/axiosWrapper';
import {Criteria} from 'components/pages/FindEmployees/Criteria';
import {PeopleRow} from 'components/pages/FindEmployees/PeopleRow';
import {UserDataView} from 'components/pages/FindEmployees/UserDataView/UserDataView';
import { SMUserBar } from 'components/common/SMUserBar/SMUserBar';

const { Option } = Select;

function FindPeople(props){

    const CRITERIA = Criteria();
    const id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const [criteriaValue, setCriteriaValue] = useState("");
    const [userData, setUserData] = useState(null);
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

    const handleAddEvent = () => {
        const rows = {
          id: id,
        }

        setDisabledBtn(true);
        setdataFields(dataFields.concat(rows));
    }

    const handleRowDel = (rows) => {
        dataFields.splice(rows, 1);
        const delRow = [...dataFields];
        setdataFields(delRow);
    };

    const handleDisabled = () => {
        const fieldsValue = getFieldsValue();
        const fieldsRow = fieldsValue[rowIndex];
        if( (fieldsRow.opCondition) && (fieldsRow.profeciency || fieldsRow.list || fieldsRow.experince || fieldsRow.branch || fieldsRow.position)) {
            setDisabledBtn(false);
        }
    }

    const renderFields = (data, index) => {
        if (dataFields[index]) {
            setrowIndex(dataFields[index].id);
            return getFieldDecorator(`${dataFields[index].id}[${data.key}]`)(
                <Select key={index} placeholder={data.name} onSelect={handleDisabled}>
                    { data.items.map(item => <Option key={index} value={item.name}>{item.name}</Option>)}
                </Select>
            )
        } else {
            return (
                <Select key={index} placeholder={data.name} onSelect={handleDisabled}>
                    { data.items.map(item => <Option key={index} value={item.name}>{item.name}</Option>)}
                </Select>
            )
        }
    }

    const addSelectField = (indexRow, criteriaVal) => (
        Object.values(CRITERIA).map((criteria) => {
            if(criteria.name !== criteriaVal){
                return null;
            }

            return criteria.input.map((data, index) => {
                return (
                <Col key={index} span={5}>
                <Col className="label_select"><span>{data.name}</span></Col>
                    {renderFields(data, indexRow)}
                </Col>
            )}
            )
        })
    );

    const handleResetFields = () => {
        resetFields();
        setdataFields([{
            id: id
        }]);
        setUserData(null);
        setCriteriaValue();
        setDisabledBtn(true);
    }

    const getIdValues = (type, item) => {
        const id = [];
        Object.values(CRITERIA).map((criteria) => {
            if(criteria.name !== type) {
                return null;
            }

            criteria.input.map((data, index) => {
                if(data.key === "list"){
                    data.items.map(e => {
                        if(e.name === item){
                            id.push(e.id);
                        }
                    })
                }
            });
        });
        return id[0];
        }



    const handleSubmit = (e) => {
        e.preventDefault();
        refForScroll.current.scrollTo(0,0);
        setCollapseFind(true);

        validateFields((err, values) => {
            if (!err) {
               const bodyObject = Object.values(values).map(item => {
                const itemObject  = (
                    (item.type === "Branch") ?
                        { name: item.branch } :
                    (item.type === "Position") ?
                        { name: item.position } :
                    {
                        // id: getIdValues(item.type, item.list),
                        name: item.list,
                        experience: item.experience,
                    }
                );

                    return {
                        type: item.type && item.type.toLowerCase(),
                        opCondition: item.opCondition,
                        items: itemObject,
                        relCondition: item.relCondition ? item.relCondition.toLowerCase() : "and"
                    }
                })

                post({url: "search", data: bodyObject}).then(result => {
                        result.data.users = result.data.users.map(item => {
                        item.key = item.guid
                        const colorCode = Math.floor(100000 + Math.random() * 900000);
                        item.avatar = <SMUserBar
                                        colorCode={colorCode}
                                        firstName={item.fname}
                                        lastName={item.lname}
                                        size='medium'
                                    />
                        return item;
                    });

                    setUserData(result.data.users);
                }).catch(error => {
                    //TODO handle error
                    console.error("Error:", error);
                });
            }
          });
    }

    const collapsesOut = () => {
        setCollapseFind(false);
    }

    const selectCriteriaValue = ( value ) => {
        setCriteriaValue(value);
        return value;
    }

    return (
        <>
        <div ref={refForScroll} className={`main_container_people_finder ${collapseFind && "default_main_container"} `}>
            <Row className="people_finder_header">
                <h1>Find people </h1>
            </Row>
            <Row className= {collapseFind ? "collapses_visible" : "collapses_hidden"}>
                <Icon onClick={collapsesOut} type="double-right" />
            </Row>
            <Form onSubmit={handleSubmit}>
                <Form.Item>
                    {dataFields.map((item, index) => <PeopleRow key={item.id}
                        onRowDel={handleRowDel}
                        rows={item}
                        rowIndex={index}
                        addSelectField={addSelectField}
                        criteriaValue={selectCriteriaValue}
                        dataFields={dataFields}
                        formItem={props.form}
                        />)}
                </Form.Item>
                <Row>
                    <Button disabled={disabledBtn} onClick={handleAddEvent} icon="plus" className={criteriaValue ? "" : "visible_info_desc"} id={disabledBtn ? "add_people_btn_disabled" : "add_people_btn_enabled"}>
                         Add more criteria
                    </Button>
                </Row>

                <Form.Item className={criteriaValue ? "people_finder_buttons" : "visible_info_desc"}>
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
            <Row type="flex" justify="center" className={criteriaValue ? "visible_info_desc" : "main_info_desc"}>
                <Col className="people_finder_info_desc">Please select the criteria to find employees</Col>
            </Row>
        </div>
        {userData && <UserDataView userData={userData} history={props.history}/> }
        </>
    )
}

const FindEmployees = Form.create({ name: 'FindEmployees' })(FindPeople);
export { FindEmployees };