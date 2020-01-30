import React, {useState} from 'react';
import {Select, Row, Col, Button} from 'antd';
import {SearchRow} from './SearchRow';
import {SMIcon} from 'view/components/SMIcon';
import {SMConfig} from 'config';
import {uuid} from '../../../../../configSearch/criteria';

const {Option} = Select;

function SearchGroup(props) {


    const rules = {
        type: 'rule',
        properties: {}
    };

    const groups = {
        type: 'group',
        childrens: {},
        condition: 'And'
    };

    const [groupData, setGroupData] = useState(props.defaultProperties);

    const handleClickAddCriteria = () => {
        groupData.childrens = {...groupData.childrens, [uuid()]: rules};
        setGroupData({...groupData});
    };

    const handleClickAddGroup = () => {
        groupData.childrens = {...groupData.childrens, [uuid()]: groups};
        setGroupData({...groupData});
    };

    const handleChangeChildInfo = (nweProperties, rowId, childrenId = null) => {
        Object.keys(groupData.childrens).map(item => {
            if(item === rowId) {
                if(groupData.childrens[item].type === 'group' && childrenId !== null) {
                    groupData.childrens[item] = nweProperties;
                } else if(groupData.childrens[item].type === 'rule') {
                    groupData.childrens[item].properties = nweProperties[item];
                }
                setGroupData({...groupData});
            }
        });
        props.update(groupData, props.groupId, childrenId);
    };

    const handleDeleteRow = (rowId) => {
        delete groupData.childrens[rowId];
        setGroupData({...groupData});
    };

    const handleChangeCondition = (val) => {
        groupData.condition = val;
        setGroupData({...groupData});
        props.update(groupData, props.groupId, props.groupId);
    };

    const handleDeleteGroupRow = () => {
        props.delete(props.groupId);
    };

    const renderRows = () => {
        if(Object.keys(groupData.childrens).length === 0) {
            handleClickAddCriteria();
        }
        return (<Row className="group--children">{Object.keys(groupData.childrens).map((item, index) => {

            const displayDellBtn = Object.keys(groupData.childrens).length === 1 && index === 0 ? 'display_dell_btn' : '';

            if(groupData.childrens[item].type === 'rule') {
                return (
                    <SearchRow
                        disabled={props.disabled}
                        defaultProperties={groupData.childrens[item]}
                        content={props.content}
                        className={displayDellBtn}
                        criteriaId={item}
                        delete={handleDeleteRow}
                        update={handleChangeChildInfo}
                        form={props.form}
                        key={item} />
                );
            } else if(groupData.childrens[item].type === 'group') {
                return (
                    <SearchGroup
                        disabled={props.disabled}
                        defaultProperties={groupData.childrens[item]}
                        content={props.content}
                        parentsCount={props.parentsCount + 1}
                        className={displayDellBtn}
                        groupId={item}
                        delete={handleDeleteRow}
                        update={handleChangeChildInfo}
                        form={props.form}
                        key={item} />
                );
            }
        })}</Row>);
    };

    const addGroup = () => {
        if(props.parentsCount < 2) {
            return (
                <Col {...props.content.contentCol}>
                    <Button disabled={props.disabled} icon="plus-circle" onClick={handleClickAddGroup}>
                        {SMConfig.search.search.buttons.add_group}
                    </Button>
                </Col>
            );
        }
    };

    return (
        <Row className="group-rows">
            <Row>
                <Row className="header_container" justify="center" >
                    <Col>
                        <Col {...props.content.rowColFirst}>
                            <Select disabled={props.disabled} defaultValue={props.defaultProperties.condition} onSelect={handleChangeCondition}>
                                <Option value={SMConfig.search.search.condition.and}>{SMConfig.search.search.condition.and}</Option>
                                <Option value={SMConfig.search.search.condition.or}>{SMConfig.search.search.condition.or}</Option>
                            </Select>
                        </Col>
                        <Col {...props.content.contentCol}>
                            <Button disabled={props.disabled} icon="plus" onClick={handleClickAddCriteria}>
                                {SMConfig.search.search.buttons.add_criteria}
                            </Button>
                        </Col>
                        {addGroup()}
                    </Col>
                    <Col className="del_btn_right" span={1}>
                        <Button onClick={handleDeleteGroupRow} className={`delBtn  ${props.className}`}>
                            <SMIcon iconType="far" icon="trash-alt" />
                        </Button>
                    </Col>
                </Row>
                {renderRows()}
            </Row>
        </Row>
    );
}

export {SearchGroup};
