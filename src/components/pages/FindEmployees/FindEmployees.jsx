import React, {useState, useEffect} from 'react';

import { Row, Form, Col, Icon, Select, Button } from 'antd';
import { post, get } from 'client/lib/axiosWrapper';
import {CRITERIA} from 'config/crieterias';
import {PeapleRow} from 'components/pages/FindEmployees/PeapleRow';

const { Option } = Select;

function PeopleFind(props){
    const id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const [criteriaValue, setCriteriaValue] = useState("");
    const [getCategories, setCategories] = useState([]);
    const [dataFields, setdataFields] = useState([
    ]);
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [collapseFind, setCollapseFind] = useState(false);
    const [bodyObj, setBodyObj] = useState(
        [
            {
            "type": "user",
            "opCondition": "equal",
            "items": {
              "branchName": "Vanadzor"
            }
          },
            {
            "type": "user",
            "opCondition": "equal",
            "items": {
              "position": "QA Tester"
            }
          },
        
           {
            "type": "skill",
            "opCondition": "equal",
            "items": {
              "name": "NodeJS"
            }
          },
           {
            "type": "category",
            "opCondition": "equal",
            "items": {
              "name": "BE",
              "experience": 8
            }
          }
          
        ]
    );

      const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
          md: {span: 24},
          lg: {span: 24},
          xl: {span: 24},
          xxl: {span: 24}
        }
      };
    
    useEffect(()=>{
        get({url: "categories/all"}).then(result => {
            setCategories(result.data);
        });
    }, []);

    const handleAddEvent = () => {
        debugger
        const rows = {
          id: id,
          criteriaValue: "",
          value: []
        }

        dataFields.push(rows);

        const data = dataFields.slice();
        const newFields = data.map((rows) => {
            return rows;
        });
        
        setDisabledBtn(true);
        
        setdataFields(newFields);
    }

    const handleRowDel = (rows) => {
        const index = dataFields.indexOf(rows);
        dataFields.splice(index, 1);
        const delRow = [...dataFields];
        setdataFields(delRow);
    };

    const handleDisabled = (e) => {
        const { getFieldsValue, getFieldValue } = props.form;

        // getFieldValue(defaultObj[0].id)["Condition"] ?  setDisabledBtn(false) : setDisabledBtn(true);
    }

    const aaa = (data, index) => {
        if (dataFields[index]) {
            return getFieldDecorator(`${dataFields[index].id}[${data.name}]`)(
                <Select key={index} placeholder={data.name} onSelect={handleDisabled}>
                    { data.items.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
                </Select>
                )
        } else {
            return (
                <Select key={index} placeholder={data.name} onSelect={handleDisabled}>
                { data.items.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)}
            </Select>
            )
        }
    }

    const addSelectField = (index1, rowIndex) => {
        debugger
        return (Object.values(CRITERIA).map((criteria, index) => {
            if((criteria.name !== rowIndex) ){
                return null;
            }
            if(!dataFields.length) {}
            return criteria.input.map((data, indexs) => (
                <Col key={indexs} span={5}>
                    {aaa(data, index1)}
                </Col>
            ))

        }));
    }

    const handleChange = value => {
        setCriteriaValue(value);
    }

    const handleResetFields = () => {
        props.form.resetFields();
        setCriteriaValue('');
        setdataFields([]);
        setDisabledBtn(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        document.getElementsByClassName("main_container_people_finder")[0].scrollTop = 0
        setCollapseFind(true);
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values,"??????????????")
                post({url: "search", data: bodyObj}).then(result => {
                    console.log(result);
                })
            }
          });
    }

    const collapsesOut = () => {
        setCollapseFind(false);
    }
      
    const { getFieldDecorator } = props.form;

    console.log(props.form.getFieldsValue())

    return (
        <div className={`main_container_people_finder ${collapseFind && "default_main_container"} `}>
            <Row className="people_finder_header">  
                <h1>Find people </h1>
            </Row>
            <Col className= {collapseFind ? "collapses_visible" : "collapses_hidden"}>
                <Icon onClick={collapsesOut} type="double-right" />
            </Col>
            <Form onSubmit={handleSubmit}>
                <Form.Item >
                    {<Row gutter={16}>
                        <Col span={5}>
                            {getFieldDecorator("type")(
                        <Select
                            placeholder="Criteria"
                            onChange={handleChange}
                        >
                        {Object.values(CRITERIA).map((item, index) => 
                            <Option key={index} value={item.name}>{item.name}</Option>
                        )}
                        </Select>
                            )}
                        </Col>
                        <Col span={18}>
                            <Row gutter={16}>
                                {addSelectField(0, criteriaValue)}
                            </Row>
                        </Col>
                    </Row>}
                        {dataFields.map((item, index) => <PeapleRow key={item.id}
                            onRowDel={handleRowDel} 
                            rows={item}
                            rowIndex1={index+1}
                            addSelectField={addSelectField}
                            criteriaValue={criteriaValue}
                            dataFields={dataFields}
                            form={props.form}
                        />)}
                        </Form.Item>
                <Form.Item>
                    <Button disabled={false} onClick={handleAddEvent} icon="plus" className={criteriaValue ? "" : "visible_info_desc"} id={disabledBtn ? "add_people_btn_disabled" : "add_people_btn_enabled"}>
                         Add more criteria
                    </Button>
                </Form.Item>
               
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
    )
}

const FindEmployees = Form.create({ name: 'FindEmployees' })(PeopleFind);
export { FindEmployees };