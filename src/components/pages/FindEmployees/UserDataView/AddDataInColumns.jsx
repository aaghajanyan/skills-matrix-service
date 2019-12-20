import React from 'react';

import {Row, Col} from 'antd';

function AddDataInColumns(props){
    const data = [];

    props.userData.map((item, index) => {
        const row = {
            key: index,
            avatar: item.avatar,
            position: item.position,
            branchName: item.branchName,
        };
        item.skills.map((skill, index) => {
            row[skill.name] = <Row>
                <Row><Col span={10}>Experience:</Col><Col span={5}>{skill.skillMark.experience}</Col>  </Row>
                <Row><Col span={10}>Profficience: </Col><Col span={5}>{skill.skillMark.profficience}</Col></Row>
            </Row>
        });
        data.push(row);
    })

    return data;
}

export {AddDataInColumns}