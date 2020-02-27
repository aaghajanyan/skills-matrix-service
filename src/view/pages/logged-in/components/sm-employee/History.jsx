import React, {useEffect, useState} from 'react';
import {Row, Col, Timeline} from 'antd';
import {getHistoryInfo} from 'src/services/skillsHistoryService';
import {getSkillsData} from 'src/services/skillsService';
import moment from 'moment';

function History(props) {


    const [skillsHistory, setSkillsHistory] = useState([]);

    const [skillsdata, setSkillsdata] = useState([]);


    useEffect(()=>{
        getHistoryInfo(props.userGuid)
        .then(result => {
            setSkillsHistory(result.historySkills)
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
    },[])


    const getSkillName =   () => {

        const skillData = {}
        skillsdata.map(item => {
            Object.assign(skillData , {[item.id]: item.name})
        })

        return skillData;
    }

    const skillNames = getSkillName();

    return (
        <React.Fragment>
            <Row className="sm-component">
                <h1 className="sm-subheading">History</h1>
                <Timeline >
                    {skillsHistory.map((item, index) =>
                        <Timeline.Item key={index} color="red">
                            <p>
                                Updated Skill: {`${skillNames[item.skill_id]} `}
                                Experience: {`${item.experience} `}
                                Profficience: {`${item.profficience} `}
                                {`${moment(item.created_date).format('YYYY-MMM-DD')} `}
                            </p>
                        </Timeline.Item> )}
                </Timeline>
            </Row>
        </React.Fragment>
    )
}

export {History};