import React from 'react';
import {Row, Col} from 'antd';
import {SMConfig} from 'config';
import moment from 'moment';

function SkillsColumns(props) {
    const data = [];

    props.userData.forEach((item, index) => {
        const row = {
            key: index,
            avatar: item.avatar,
            position: item.position.name,
            branchName: item.branch.name,
            guid: item.guid
        };
        item.skills.map((skill) => {
            row[skill.name] = <Row style={skill.skillMark.profficience < 3 ? {'background': SMConfig.search.colors_search_table.yellow, padding: '16px 16px'} : skill.skillMark.experience > 3 ? {'background': SMConfig.search.colors_search_table.green, padding: '16px 16px'} : {'background': SMConfig.search.colors_search_table.blue, padding: '16px 16px'}}>
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