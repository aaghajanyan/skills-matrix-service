import React, { useState, useEffect, useRef } from 'react';
import { Select, Row, Col, Button } from 'antd';
import { FindCriteria } from './FindCriteria';
import { FindGroup } from './FindGroup';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import {getSearchParams} from 'store/actions/search';

import queryString from 'query-string';

import base64 from 'base-64';

const { Option } = Select

const uuid = () => "ID" + (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);

export default function PeopleRows(props) {

    const JsonRules = {
        type: "rule",
        properties: {}
    }

    const generalId = uuid();

    const DefoultTree = {
        "type": "group",
        "id": generalId,
        "childrens":
        {
            [uuid()]: JsonRules
        }
        ,
        "condition": "And"
    }


    let history = useHistory();

    const dispatch = useDispatch();

    const clickFind = useRef();

    const paramsRedux = useSelector((state) => {
        return  {
            defoultFields: state.Search.items
        }
    });
    const query = queryString.parse(history.location.search);
    const getDefaultValue = () => {
        if(query.search_query && JSON.parse(base64.decode(query.search_query))) {
            return JSON.parse(base64.decode(query.search_query));
        } else {
            return paramsRedux.defoultFields ? paramsRedux.defoultFields.values : props.data ? props.data.fieldValues : DefoultTree;
        }
    };

    useEffect(()=>{
        if(query.search_query && JSON.parse(base64.decode(query.search_query))) {
            clickFind.current.buttonNode.click();
        }
    },[])

    const [loadInitValue, setLoadInitValue] = useState(getDefaultValue());

    const JsonGroups = {
        type: "group",
        childrens: {},
        condition: "And"
    }

    const contentColForRow = {
        contentCol : {
            xs: {span: 6},
            sm: {span: 6},
            md: {span: 6},
            lg: {span: 6},
            xl: {span: 5},
            xxl: {span: 3},
        },
        rowColFirst : {
            xs: {span: 3},
            sm: {span: 3},
            md: {span: 3},
            lg: {span: 3},
            xl: {span: 3},
            xxl: {span: 2},
        },
        contentRightSelect: {
            xs: {span: 24},
            sm: {span: 24},
            md: {span: 6},
            lg: {span: 6},
            xl: {span: 5},
            xxl: {span: 5},
        },
        buttonsCol: {
            xs: {span: 4},
            sm: {span: 4},
            md: {span: 4},
            lg: {span: 4},
            xl: {span: 2},
            xxl: {span: 2},
        }

    }

    const handleClickAddGroup = () => {
        loadInitValue.childrens = Object.assign(loadInitValue.childrens, { [uuid()]: JsonGroups });
        setLoadInitValue({ ...loadInitValue });
    }

    const handleClickAddCriteria = () => {
        loadInitValue.childrens = Object.assign(loadInitValue.childrens, { [uuid()]: JsonRules });
        setLoadInitValue({ ...loadInitValue });
    }

    const handleChangeChildInfo = (nweProperties, rowId, childrenId=null) => {

        Object.keys(loadInitValue.childrens).map(item => {
            if(item === rowId) {
                if(loadInitValue.childrens[item].type === 'group' &&  childrenId !== null){
                    loadInitValue.childrens[item] = nweProperties;

                } else if(loadInitValue.childrens[item].type === 'rule') {
                    loadInitValue.childrens[item].properties = nweProperties[item];
                }
                dispatch(getSearchParams(loadInitValue));

                setLoadInitValue({ ...loadInitValue });

            }
        })
    }

    const handleDeleteRow = (rowId) => {
        delete loadInitValue.childrens[rowId];
        setLoadInitValue({ ...loadInitValue });
    };

    const handleReset = () => {
        setLoadInitValue(DefoultTree);
    }

    const handleChangeCondition = (val) => {
        loadInitValue.condition = val;
        dispatch(getSearchParams(loadInitValue));
        setLoadInitValue({ ...loadInitValue });
    }


    const handleClickFind = () => {
        props.getTree(loadInitValue);
        const encodValue = base64.encode(JSON.stringify(loadInitValue));
        history.push(`/find_employees/result?search_query=${encodValue}`);
        dispatch(getSearchParams(loadInitValue));

    }

    const renderCriterias = () => {

        if (Object.keys(loadInitValue.childrens).length === 0) {
            handleClickAddCriteria();
        }

        return (
        <Row className="group--children">
            {Object.keys(loadInitValue.childrens).map((item, index) => {
                let displayDellBtn = "";
                if ((Object.keys(loadInitValue.childrens).length === 1 && index === 0)) {
                    displayDellBtn = "display_dell_btn";
                }
                if (loadInitValue.childrens[item].type === 'rule') {
                    return (
                        <FindCriteria
                            defaultProperties={loadInitValue.childrens[item]}
                            content={contentColForRow}
                            className={displayDellBtn}
                            criteriaId={item}
                            delete={handleDeleteRow}
                            update={handleChangeChildInfo} form={props.formItem} key={item} />
                    );
                } else if (loadInitValue.childrens[item].type === 'group') {
                    return (
                        <FindGroup
                            defaultProperties={loadInitValue.childrens[item]}
                            content={contentColForRow}
                            parentsCount={0}
                            className={displayDellBtn}
                            groupId={item}
                            delete={handleDeleteRow}
                            update={handleChangeChildInfo} form={props.formItem} key={item} />
                    );
                }
            })}
        </Row>
        );
    }

    return (
        <Row>
            <Row className="header_container" justify="center">
                <Col {...contentColForRow.rowColFirst} >
                    <Select defaultValue={loadInitValue.condition} onSelect={handleChangeCondition}>
                        <Option value='And'>And</Option>
                        <Option value='Or'>Or</Option>
                    </Select>
                </Col>
                <Col {...contentColForRow.contentCol} >
                    <Button icon="plus" onClick={handleClickAddCriteria}>
                        Add more criteria
                    </Button>
                </Col>
                <Col {...contentColForRow.contentCol} >
                    <Button icon="plus-circle" onClick={handleClickAddGroup}>
                        Add group
                    </Button>
                </Col>
            </Row>
            {renderCriterias()}
            <Row className="people_finder_buttons" gutter={10} justify="center">
                <Col {...contentColForRow.buttonsCol}>
                    <Button ref={clickFind} onClick={handleClickFind} type="primary" htmlType="submit" id="people_finder_btn">
                        Find
                    </Button>
                </Col>
                <Col {...contentColForRow.buttonsCol}>
                    <Button onClick={handleReset} id="reset_people_btn"> Reset </Button>
                </Col>
            </Row>
        </Row>
    )
}