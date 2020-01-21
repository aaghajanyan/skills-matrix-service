import React, { useState } from 'react';
import { Select, Row, Col, Button } from 'antd';
import { FindCriteria } from './FindCriteria';

const { Option } = Select

function FindGroup(props) {

    const uuid = () => "ID" + (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);

    const JsonRules = {
        type: "rule",
        properties: {}
    }

    const JsonGroups = {
        type: "group",
        childrens: {},
        condition: "And"
    }

    const [groupData, setGroupData] = useState(props.defaultProperties);

    const handleClickAddCriteria = () => {
        groupData.childrens = Object.assign(groupData.childrens, { [uuid()]: JsonRules });
        setGroupData({ ...groupData });
    }

    const handleClickAddGroup = () => {
        groupData.childrens = Object.assign(groupData.childrens, { [uuid()]: JsonGroups });
        setGroupData({ ...groupData });
    }

    const handleChangeChildInfo = (nweProperties, rowId, childrenId=null) => {
        Object.keys(groupData.childrens).map(item => {
            if(item === rowId) {
                if(groupData.childrens[item].type === 'group' && childrenId !== null){
                    groupData.childrens[item] = nweProperties;//.childrens[childrenId] = nweProperties.childrens[childrenId];
                } else if(groupData.childrens[item].type === 'rule') {
                    groupData.childrens[item].properties = nweProperties[item];
                }

                setGroupData({ ...groupData });
            }
        })
        props.update(groupData, props.groupId, childrenId);
    }

    const handleDeleteRow = (rowId) => {
        delete groupData.childrens[rowId];
        setGroupData({ ...groupData });
    };

    const handleChangeCondition = (val) => {
        groupData.condition = val;
        setGroupData({ ...groupData });
        props.update(groupData, props.groupId, val);
    }

    const handleDeleteGroupRow = () => {
        props.delete(props.groupId);
    }

    const renderCriterias = () => {
        if (Object.keys(groupData.childrens).length === 0) {
            handleClickAddCriteria();
        };
        return (<Row className="group--children">{Object.keys(groupData.childrens).map((item, index) => {
            let displayDellBtn = "";
            if (Object.keys(groupData.childrens).length === 1 && index === 0) {
                displayDellBtn = "display_dell_btn";
            }

            if (groupData.childrens[item].type === 'rule') {
                return (
                    <FindCriteria
                        defaultProperties={groupData.childrens[item]}
                        content={props.content}
                        className={displayDellBtn}
                        criteriaId={item}
                        delete={handleDeleteRow}
                        update={handleChangeChildInfo} form={props.form} key={item} />
                );
            } else if (groupData.childrens[item].type === 'group') {
                return (
                    <FindGroup
                        defaultProperties={groupData.childrens[item]}
                        content={props.content}
                        parentsCount={props.parentsCount + 1}
                        className={displayDellBtn}
                        groupId={item}
                        delete={handleDeleteRow}
                        update={handleChangeChildInfo} form={props.form} key={item} />
                );
            }
        })}</Row>)
    }

    const renderAddGroup = () => {
        if (props.parentsCount < 2) {
            return (
                <Col {...props.content.contentCol}>
                    <Button icon="plus-circle" onClick={handleClickAddGroup}>
                        Add group
                    </Button>
                </Col>
            );
        }
    }

    return (
        <Row className="group-rows">
            <Row>
                <Row className="header_container" justify="center" >
                    <Col>
                        <Col {...props.content.rowColFirst}>
                            <Select defaultValue={props.defaultProperties.condition} onSelect={handleChangeCondition}>
                                <Option value='And'>And</Option>
                                <Option value='Or'>Or</Option>
                            </Select>
                        </Col>
                        <Col {...props.content.contentCol}>
                            <Button icon="plus" onClick={handleClickAddCriteria}>
                                Add more criteria
                            </Button>
                        </Col>
                        {renderAddGroup()}
                    </Col>
                    <Col className="del_btn_right" span={1}>
                        <Button className={`delBtn ${props.className}`} onClick={handleDeleteGroupRow} icon="delete"></Button>
                    </Col>
                </Row>
                {renderCriterias()}
            </Row>
        </Row>
    )
}

export { FindGroup };
