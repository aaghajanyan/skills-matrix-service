import React from 'react';

import {Row, Col} from 'antd';

function AddDataInColumns(props){
    const data = [];
    const colors = [
        {
            key: "yellow",
            color: "#faad14c7"
        },
        {
            key: "blue",
            color: "#1890ff"
        },
        {
            key: "green",
            color: "#52c41a"
        }
    ];

    props.userData.map((item, index) => {
        const row = {
            key: index,
            avatar: item.avatar,
            position: item.position,
            branchName: item.branchName,
            guid: item.guid,
        };
        item.skills.map((skill, index) => {
            row[skill.name] = <Row style={skill.skillMark.profficience < 3 ? {"background": colors[0].color, padding: "16px 16px"} : skill.skillMark.experience > 3 ? {"background": colors[2].color, padding: "16px 16px"} : {"background": colors[1].color, padding: "16px 16px"}}>
                <Row><Col className="left_col_skill_info" span={12}>Exp. :</Col><Col className="right_col_skill_info" span={5}>{skill.skillMark.experience}</Col> </Row>
                <Row><Col className="left_col_skill_info" span={12}>Prof. : </Col><Col className="right_col_skill_info" span={5}>{skill.skillMark.profficience}</Col></Row>
                <Row><Col className="left_col_skill_info" span={12}>L. Date. : </Col><Col className="right_col_skill_info" span={12}> - </Col></Row>
            </Row>
        });
        data.push(row);
    })

    return data;
}

export {AddDataInColumns}