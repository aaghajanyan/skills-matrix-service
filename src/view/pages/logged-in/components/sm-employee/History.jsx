import React, { useEffect, useState } from 'react';
import { Row, Timeline, AutoComplete, Col, DatePicker, Button, Input, Icon, Divider } from 'antd';
import {getSkillsData} from 'src/services/skillsService';

import moment from 'moment';

function History(props) {
    const [skillsHistory, setSkillsHistory] = useState(props.skills);
    const [skillsData, setSkillsData] = useState();
    const [search, setSearch] = useState(false);
    const [loadMore, setLoadMore] = useState(1);
    const [findInfo, setFindInfo] = useState({
        skill: '',
        from: '',
        to: ''
    });

    let skillNames = {};
    let skills = {};
    let items = [];

    const getSkillNames = () => {
        skillsData && skillsData.map( skill => {
            skillNames[skill.id] = skill.name.charAt(0).toUpperCase() + skill.name.slice(1).toLowerCase();
        });
    }

    const getAllData = () => {
        setSkillsHistory(props.skills);
        setLoadMore(1);
        getSkillsData()
        .then( result => {
            setSkillsData(result);
        })
        .catch(error => {
            console.log("Handle Error: ", error)
        })

    }

    useEffect(()=> {
        getAllData();
    }, [props.dashboard]);

    getSkillNames();

    const getOptions = () => {
        const optionsList = [];
        skillNames && Object.values(skillNames).map(skill => {
            optionsList.push(skill);
        })
        return optionsList;
    }

    const setHistoryColor = (before, after) => {
        if(after.operation === 'create') {
            return 'green';
        } else if (after.operation === 'delete') {
            return 'red';
        } else {
            if(after.profficience > before.profficience) {
                return 'green';
            } else if(after.profficience < before.profficience) {
                return 'red';
            }
        }
        return 'blue';
    }

    const renderItemUpdate = (before, history) => {
        let str = '';
        if( history.experience !== before.experience ) {
            str += ` : Experience changed from ${before.experience} to ${history.experience}`;
        }
        if ( history.profficience !== before.profficience ) {
            str += ` : Profficience changed from ${before.profficience} to ${history.profficience}`;
        }
        if ( history.last_worked_date !== before.last_worked_date ) {
            str += ` : Last worked date changed from ${moment(before.last_worked_date).format('YYYY-MMM-DD')} to ${moment(history.last_worked_date).format('YYYY-MMM-DD')}`;
        }
        return str
    }

    const handleOnSelect = data => {
        const newInfo = findInfo;
        newInfo.skill = data;
        setFindInfo({...newInfo})
    };

    const handleChangeFromDatePicker = (e) => {
        const info= findInfo;
        info.from = (e ? e : '');
        setFindInfo({...info});
    }

    const handleChangeToDatePicker = (e) => {
        const info= findInfo;
        info.to = (e ? e : '');
        setFindInfo({...info});
    }

    const findHistory = (item) => {
        return (!findInfo.from  ? true : ( new Date(moment(findInfo.from)) <= new Date(moment(item.created_date))) ) &&
            (!findInfo.to  ? true : ( new Date(moment(findInfo.to)) >= new Date(moment(item.created_date))) ) &&
            (findInfo.skill === '' ? true : findInfo.skill === skillNames[item.skill_id] ? true : false);
    }

    const handleOnChange = (e) => {
        const newInfo = findInfo;
        newInfo.skill = e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
        setFindInfo({...newInfo})
    }

    const renderFilterFields = () => {
            return (
                <Row className="sm-filter-history" gutter={20}>
                    <Col span={12}>
                        <AutoComplete
                            dataSource={getOptions()}
                            placeholder="Skill name"
                            onSelect={handleOnSelect}
                            onChange={handleOnChange}
                            className={search ? "sm-visible-field" : "sm-hidden-field" }
                        >
                            <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                        </AutoComplete>
                    </Col>
                    <Col span={6}>
                        <DatePicker className={search ? "sm-visible-field" : "sm-hidden-field" } placeholder="From" key="from" format={'YYYY-MM-DD'} onChange={handleChangeFromDatePicker}/>
                    </Col>
                    <Col span={6}>
                        <DatePicker className={search ? "sm-visible-field" : "sm-hidden-field" } placeholder="To" key="to" format={'YYYY-MM-DD'} onChange={handleChangeToDatePicker}/>
                    </Col>
                </Row>
            )
    }

    const renderHistory = () => {
        let newItems = [];
        skillsHistory.map((history, index) => {
            const name = skillNames[history.skill_id];
            const before = {};
            if(name && skills[name]) {
                Object.assign( before, skills[name]);
                if(history.operation === 'delete') {
                    delete skills[name];
                } else {
                    skills[name] = history;
                }
            } else if (name) {
                skills[name] = history;
            }

            if(findHistory(history)) {
                newItems.push(
                    <Row key={index} className="sm-history-row">
                        <Col span={1}>
                            {`${moment(history.created_date).format('YYYY-MMM-DD')}`}
                        </Col>
                        <Col span={12}>
                            <Timeline.Item key={index} color={setHistoryColor(before, history)}>
                                {name}
                                { (history.operation !== 'delete') ? ((Object.keys(before).length > 0 ) ? renderItemUpdate(before, history) :
                                ( ` : Experience ${history.experience} : Profficience ${history.profficience} : Last worked date ${moment(history.last_worked_date).format('YYYY-MMM-DD')}` ) ) : ``}
                            </Timeline.Item>
                        </Col>
                    </Row>
                )
            }
        });
        items = newItems;
        let flag = (loadMore*10 <= items.length);
        flag ? newItems = items.slice(-(loadMore*10)) : items ;

        return (
            <Timeline mode="left">
                {newItems.reverse()}
            </Timeline>
        )
    }

    const reenderLoadMore = () => {
        return (<Row className="sm-load-more">
            { (loadMore > 1 && loadMore*10 < items.length) ? (<><Button onClick={() => {setLoadMore(loadMore+1)}}><Icon type="arrow-down" /></Button>
                <div className="spliter"></div>
                <Button onClick={()=> {setLoadMore(1)}}><Icon type="arrow-up" /></Button> </>) :
            (loadMore*10 < items.length) ? (<Button onClick={()=> {setLoadMore(loadMore+1)}}><Icon type="arrow-down" /></Button>) :
            (items.length > 10) ? (<Button onClick={() => {setLoadMore(1)}}><Icon type="arrow-up" /></Button>) : ""}
        </Row>);
    }

    return (
        <React.Fragment>
            <Row className="sm-component">
                <Row gutter={20}>
                    <Col span={12}>
                        <h1 name="History" className="sm-title">History</h1>
                    </Col>
                    <Col span={12}>
                        <Col span={20}>
                            {renderFilterFields()}
                        </Col>
                        <Col span={3} className="search-button">
                            <Button onClick={() => {setSearch(!search)}} >
                                {(!search) ? "Filter" : "Close"}
                                <Icon  type={ search ? "close" : "search"}/>
                            </Button>
                        </Col>
                    </Col>
                </Row>
                <br/>
                <Divider />
                <Row>
                    {renderHistory()}
                    {reenderLoadMore()}
                </Row>
            </Row>
        </React.Fragment>
    )
}

export {History};