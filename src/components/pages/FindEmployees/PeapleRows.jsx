import React, { useState } from 'react';
import { Select, Row, Col, Button } from 'antd';
import { FindCriteria } from './FindCriteria';
import { FindGroup } from './FindGroup';

const { Option } = Select

const uuid = () => "ID" + (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);

export default function PeapleRows(props) {

    const JsonRules = {
        type: "rule",
        properties: {}
    }

    const generalId = uuid();

    const JsonGroups = {
        type: "group",
        childrens: {},
        condition: "And"

    }

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

    const [loadInitValue, setLoadInitValue] = useState(DefoultTree);

    const handleClickAddGroup = () => {
        loadInitValue.childrens = Object.assign(loadInitValue.childrens, { [uuid()]: JsonGroups });
        setLoadInitValue({ ...loadInitValue });
    }

    const handleClickAddCriteria = () => {
        loadInitValue.childrens = Object.assign(loadInitValue.childrens, { [uuid()]: JsonRules });
        setLoadInitValue({ ...loadInitValue });
    }

    const handleChangeChildInfo = (nweProperties, id) => {
        Object.keys(loadInitValue.childrens).map(item => {
            loadInitValue.childrens[item].properties = nweProperties[item];
            setLoadInitValue({ ...loadInitValue });
        })
    }

    const handleChangeGroupChildInfo = (newProperties, id) => {
        Object.keys(loadInitValue.childrens).map(item => {
            if (id === item) {
                loadInitValue.childrens[item] = newProperties;
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
        setLoadInitValue({ ...loadInitValue });
    }


    const handleClickFind = () => {
        props.getTree(loadInitValue);
    }

    const renderCriterias = () => {

        if (Object.keys(loadInitValue.childrens).length === 0) {
            handleClickAddCriteria();
        };
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
                            className={displayDellBtn}
                            criteriaId={item}
                            delete={handleDeleteRow}
                            update={handleChangeChildInfo} form={props.formItem} key={item} />
                    );
                } else if (loadInitValue.childrens[item].type === 'group') {
                    return (
                        <FindGroup
                            parentsCount={0}
                            className={displayDellBtn}
                            groupId={item}
                            delete={handleDeleteRow}
                            update={handleChangeGroupChildInfo} form={props.formItem} key={item} />
                    );
                }
            })}
        </Row>
        );
    }

    return (
        <Row>
            <Row className="header_container" justify="center">
                <Col span={2}>
                    <Select defaultValue='And' onSelect={handleChangeCondition}>
                        <Option value='And'>And</Option>
                        <Option value='Or'>Or</Option>
                    </Select>
                </Col>
                <Col span={3}>
                    <Button icon="plus" onClick={handleClickAddCriteria}>
                        Add more criteria
                    </Button>
                </Col>
                <Col span={3}>
                    <Button icon="plus-circle" onClick={handleClickAddGroup}>
                        Add group
                    </Button>
                </Col>
            </Row>
            {renderCriterias()}
            <Row className="people_finder_buttons" gutter={10} justify="center">
                <Col span={2}>
                    <Button onClick={handleClickFind} type="primary" htmlType="submit" id="people_finder_btn">
                        Find
                    </Button>
                </Col>
                <Col span={2}>
                    <Button onClick={handleReset} id="reset_people_btn"> Reset </Button>
                </Col>
            </Row>
        </Row>
    )
}