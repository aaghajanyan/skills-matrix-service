import React from 'react';
import {Row, Col} from 'antd';
import {SMConfig} from 'config';
import moment from 'moment';

function getColor(profficience) {
    return profficience < 3 ? SMConfig.search.colors_search_table.yellow :
        profficience > 3 ? SMConfig.search.colors_search_table.green :
        SMConfig.search.colors_search_table.blue;
}

function SkillsColumns(props) {
    const data = [];

    props.userData.forEach((item, index) => {
        const row = {
            key: index,
            avatar: item.avatar,
            position: item.positionTable,
            branchName: item.branchNameTable,
            guid: item.guid
        };
        item.skills.map((skill) => {
            row[skill.name] = <Row style={{'background': getColor(skill.skillMark.profficience), padding: '16px 16px'}}>
                <Row><Col className="left_col_skill_info" span={12}>Exp. :</Col><Col className="right_col_skill_info" span={5}>{skill.skillMark.experience}</Col> </Row>
                <Row><Col className="left_col_skill_info" span={12}>Prof. : </Col><Col className="right_col_skill_info" span={5}>{skill.skillMark.profficience}</Col></Row>
                <Row><Col className="left_col_skill_info" span={12}>L. Date. : </Col><Col className="right_col_skill_info" span={12}> {moment(skill.skillMark.last_worked_date).format(SMConfig.constants.dateFormatMonthName)} </Col></Row>
            </Row>;
        });
        data.push(row);
    });

    return data;
}

export {SkillsColumns};