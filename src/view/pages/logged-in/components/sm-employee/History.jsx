import React, {useEffect, useState} from 'react';
import {Row, Timeline, Tooltip, Col, List, Dropdown, Menu} from 'antd';

import {getSkillsData} from 'src/services/skillsService';
import {getCategoriesData} from 'src/services/categoryService';

import moment from 'moment';

function History(props) {
    const [skillsHistory, setSkillsHistory] = useState(props.skills);
    const [categoriesHistory, setCategoriesHistory] = useState(props.categories);
    const [skillsdata, setSkillsdata] = useState();
    const [categoriesData, setUserCategoriesData] = useState();

    const getNamesObject = () => {
        const categryData = {};
        const skillData = {}

        categoriesData && categoriesData.map(item => {
            Object.assign(categryData , {[item.id]: item.name})
        })

        skillsdata && skillsdata.map(item => {
            Object.assign(skillData , {[item.id]: item.name})
        })

        return {
            category: categryData,
            skill: skillData
        }
    }

    const filterUserInfo = (whallinfo, userInfo, prop) => {
        const userProp = [];
        const result = [];
        userInfo.filter( item => {
            if(whallinfo[item[`${prop}_id`]]){
                if(!userProp.includes(whallinfo[item[`${prop}_id`]])){
                    userProp.push(whallinfo[item[`${prop}_id`]]);
                }
            }
        })

        userProp.map((name,index) => {
            result.push({[name] : []});
                userInfo.map( item => {
                    if( prop === 'category' ? getNamesObject()[prop][item[`${prop}_id`]] === name : getNamesObject()[prop][item[`${prop}_id`]] === name ) {
                        result[index][name].push(item);
                    }
                });
        });

        return result;
    }

    const filterInfo = () => {
        let userInfo = {
            Skills : [],
            Categories : []
        };

        if(skillsdata) {
            userInfo.Skills = filterUserInfo(getNamesObject().skill, skillsHistory, 'skill');
        }
        if(categoriesData) {
            userInfo.Categories = filterUserInfo(getNamesObject().category, categoriesHistory, 'category');
        }

        return(userInfo);
    }

    const getAllData = () => {
        setSkillsHistory(props.skills);
        setCategoriesHistory(props.categories);

        getCategoriesData()
        .then( result =>  {
            setUserCategoriesData(result);
        })
        .catch(error => {
            console.log("Handle Error: ", error)
        })

        getSkillsData()
        .then( result =>  {
            setSkillsdata(result);
        })
        .catch(error => {
            console.log("Handle Error: ", error)
        })
    }

    useEffect(()=> {
        getAllData();
    }, [props.dashboard]);

    const setHistoryColor = ( group, index ) => {
        const name = Object.keys(group)[0];
        let color = "green";

        if(index > 0){
            let a = group[name][index];
            if(a.profficience > group[name][index-1].profficience){
                color = "green"
            }else if(group[name][index-1].profficience === a.profficience){
                color = "blue"
            }else {
                color = "red"
            }
        }

        return color;
    }

    const setPropColor = (lastUpdate) => {
        if(lastUpdate && lastUpdate.operation === 'delete') {
            return false;
        }
        return true;
    }

    const info = filterInfo();

    const renderTimeLineItem = (item, group, index ) => {
        const name = Object.keys(group)[0];
        return (item.operation === 'delete' ?
        <Timeline.Item key={index} color={setHistoryColor(group, index)}>
            Deleted : {moment(item.created_date).format('YYYY-MMM-DD')}
        </Timeline.Item> :
        <Tooltip placement="leftTop" key={index} title={
            <div>
                {/* {moment(item.created_date).format('YYYY-MMM-DD')} */}
                <p>Experience: {item.experience}</p>
                <p>Profficience: {item.profficience}</p>
                <p>Last worked date: {moment(item.last_worked_date).format('YYYY-MMM-DD')}</p>
            </div>
        }>
            {/* <Timeline.Item key={index} color={setHistoryColor(group, index)}>
                            { item.operation === 'update' ? <p>
                                Updated : {` ${name} `}
                                Experience: {` ${item.experience} `}
                                Profficience: {` ${item.profficience} `}
                                Last worked date: {`${moment(item.created_date).format('YYYY-MMM-DD')} `}
                            </p> :
                            <p>
                                Created : {` ${name} `}
                                Experience: {` ${item.experience} `}
                                Profficience: {` ${item.profficience} `}
                                Last worked date: {`${moment(item.created_date).format('YYYY-MMM-DD')} `}
                            </p> }
            </Timeline.Item> */}
            <Timeline.Item key={index} color={setHistoryColor(group, index)}>
                <div>{item.operation === 'create' ?
                    `Created : ${moment(item.created_date).format('YYYY-MMM-DD')}` :
                    `Updated : ${moment(item.created_date).format('YYYY-MMM-DD')}` }
                </div>
            </Timeline.Item>
        </Tooltip>)
    }

    const renderPart = (part) => {
        const count = Object.keys(info).length;
        return ( <Col span={24/count} key={part}>
            <p className="sm-sub-title" > {part} </p>
            <Timeline>
                {info[part].map((group, index) => {
                const name = Object.keys(group)[0];
                const prop = group[name][group[name].length - 1];
                const flag = setPropColor(prop)
                return (<Timeline.Item key={index} color={flag ? 'green' : 'red'} >
                    <p>
                        { flag ? 'Actual : ' : 'Deleted : ' }{`${name} `}
                    </p>
                    <Timeline>
                        {group[name].map((item, index) => {
                            return renderTimeLineItem(item, group, index);
                        })}
                    </Timeline>
                </Timeline.Item>
                )})}
            </Timeline>
        </Col>)
    }

    return (
        <React.Fragment>
            <Row className="sm-component">
                <h1 className="sm-subheading">History</h1>
                {info && Object.keys(info).map( property => {
                    return (renderPart(property));
                })}
            </Row>
        </React.Fragment>
    )
}

export {History};