import React from 'react';

function AddColumns(props){

    const columns = [
        {
            title: 'Employee',
            width: 200,
            dataIndex: 'avatar',
            key: 'avatar',
            fixed: 'left'
        },
        {
            title: 'Position',
            width: 200,
            dataIndex: 'position',
            key: 'position',
            fixed: 'left',
        },
        {
            title: 'Branch',
            width: 200,
            dataIndex: 'branchName',
            key: 'branchName',
            fixed: 'right',
        },
      ];

    props.userData.map((item) => item.skills.map( (skill, index) => {
        columns.splice(2, 0, {
            title: skill.name,
            dataIndex: skill.name,
            key: skill.name
        })
    }))

    return columns
}

export {AddColumns}
