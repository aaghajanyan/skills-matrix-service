import React, {useState, useEffect, useRef} from 'react';
import {Select, Row, Col, Button} from 'antd';
import {SearchRow} from './SearchRow';
import {SearchGroup} from './SearchGroup';
import {useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {SMConfig} from 'config';
import {uuid, contentColForRow} from '../../../../../configSearch/criteria';

import {getSearchParams} from 'store/actions/search';

import queryString from 'query-string';

const {Option} = Select;

export default function SearchTree(props) {

    const rules = {
        type: 'rule',
        properties: {}
    };

    const generalId = uuid();

    const defaultTree = {
        type: 'group',
        id: generalId,
        childrens: {
            [uuid()]: rules
        },
        condition: 'And'
    };

    const groups = {
        type: 'group',
        childrens: {},
        condition: 'And'
    };

    let history = useHistory();

    const dispatch = useDispatch();

    const clickFind = useRef();

    const paramsRedux = useSelector((state) => {
        return {
            defoultFields: state.search.items
        };
    });
    const query = queryString.parse(history.location.search);
    const getDefaultValue = () => {
        if(query.search_query && JSON.parse(atob(query.search_query))) {
            return JSON.parse(atob(query.search_query));
        } else {
            return (paramsRedux.defoultFields && paramsRedux.defoultFields.values) || (props.data ? props.data.fieldValues : defaultTree);
        }
    };

    useEffect(() => {
        if(query.search_query && JSON.parse(atob(query.search_query))) {
            clickFind.current.buttonNode.click();
        }
    },[]);

    const [loadInitValue, setLoadInitValue] = useState(getDefaultValue());

    const handleClickAddGroup = () => {
        loadInitValue.childrens = {...loadInitValue.childrens, [uuid()]: groups};

        dispatch(getSearchParams(loadInitValue));
        setLoadInitValue({...loadInitValue});
    };

    const handleClickAddCriteria = () => {
        loadInitValue.childrens = {...loadInitValue.childrens, [uuid()]: rules};

        setLoadInitValue({...loadInitValue});
    };

    const handleChangeChildInfo = (nweProperties, rowId, childrenId=null) => {

        Object.keys(loadInitValue.childrens).map(item => {
            if(item === rowId) {
                if(loadInitValue.childrens[item].type === 'group' && childrenId !== null) {
                    loadInitValue.childrens[item] = nweProperties;

                } else if(loadInitValue.childrens[item].type === 'rule') {
                    loadInitValue.childrens[item].properties = nweProperties[item];
                }
                dispatch(getSearchParams(loadInitValue));

                setLoadInitValue({...loadInitValue});

            }
        });
    };

    const handleDeleteRow = (rowId) => {
        delete loadInitValue.childrens[rowId];
        setLoadInitValue({...loadInitValue});
    };

    const handleReset = () => {
        history.push('/find_employees');
        dispatch(getSearchParams());
        setLoadInitValue(defaultTree);
    };

    const handleChangeCondition = (val) => {
        loadInitValue.condition = val;
        dispatch(getSearchParams(loadInitValue));
        setLoadInitValue({...loadInitValue});
    };


    const handleClickFind = () => {
        props.getTree(loadInitValue);
        const encodValue = btoa(JSON.stringify(loadInitValue));
        history.push(`/find_employees/result?search_query=${encodValue}`);
        dispatch(getSearchParams(loadInitValue));
    };

    const renderRows = () => {
        if(Object.keys(loadInitValue.childrens).length === 0) {
            handleClickAddCriteria();
        }

        return (
            <Row className="group--children">
                {Object.keys(loadInitValue.childrens).map((item, index) => {

                    const displayDellBtn = Object.keys(loadInitValue.childrens).length === 1 && index === 0 ? 'display_dell_btn' : '';

                    if(loadInitValue.childrens[item].type === 'rule') {
                        return (
                            <SearchRow
                                disabled={props.disabledBtn}
                                defaultProperties={loadInitValue.childrens[item]}
                                content={contentColForRow}
                                className={displayDellBtn}
                                criteriaId={item}
                                delete={handleDeleteRow}
                                update={handleChangeChildInfo}
                                form={props.formItem}
                                key={item} />
                        );
                    } else if(loadInitValue.childrens[item].type === 'group') {
                        return (
                            <SearchGroup
                                disabled={props.disabledBtn}
                                defaultProperties={loadInitValue.childrens[item]}
                                content={contentColForRow}
                                parentsCount={0}
                                className={displayDellBtn}
                                groupId={item}
                                delete={handleDeleteRow}
                                update={handleChangeChildInfo}
                                form={props.formItem}
                                key={item} />
                        );
                    }
                })}
            </Row>
        );
    };

    return (
        <Row>
            <Row className="header_container" justify="center">
                <Col {...contentColForRow.rowColFirst} >
                    <Select disabled={props.disabledBtn} defaultValue={loadInitValue.condition} onSelect={handleChangeCondition}>
                        <Option value={SMConfig.search.search.condition.and}>{SMConfig.search.search.condition.and}</Option>
                        <Option value={SMConfig.search.search.condition.or}>{SMConfig.search.search.condition.or}</Option>
                    </Select>
                </Col>
                <Col {...contentColForRow.contentCol} >
                    <Button disabled={props.disabledBtn} icon="plus" onClick={handleClickAddCriteria}>
                        {SMConfig.search.search.buttons.add_criteria}
                    </Button>
                </Col>
                <Col {...contentColForRow.contentCol} >
                    <Button disabled={props.disabledBtn} icon="plus-circle" onClick={handleClickAddGroup}>
                        {SMConfig.search.search.buttons.add_group}
                    </Button>
                </Col>
            </Row>
            {renderRows()}
            <Row className="search_buttons" gutter={10} justify="center">
                <Col {...contentColForRow.buttonsCol}>
                    <Button ref={clickFind} onClick={handleClickFind} type="primary" htmlType="submit" id="search_btn">
                        {SMConfig.search.search.buttons.find}
                    </Button>
                </Col>
                <Col {...contentColForRow.buttonsCol}>
                    <Button onClick={handleReset} id="reset_people_btn"> {SMConfig.search.search.buttons.reset} </Button>
                </Col>
            </Row>
        </Row>
    );
}