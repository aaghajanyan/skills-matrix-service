import React, {useLayoutEffect} from 'react';

function AddSearchColumns(props) {

    const skills = [];
    const columns = [
        {
            title: 'Employee',
            width: 210,
            dataIndex: 'avatar',
            key: 'avatar',
            fixed: 'left'
        },
        {
            title: 'Position',
            width: 160,
            dataIndex: 'position',
            key: 'position',
            fixed: 'left'
        },
        {
            title: 'Branch',
            width: 100,
            dataIndex: 'branchName',
            key: 'branchName',
            fixed: 'right'
        }
    ];

    props.userData.map((item) => {
        return item.skills.map( (skill, index) => {
            if(!skills.includes(skill.name)) {
                columns.splice(2, 0, {
                    title: skill.name,
                    dataIndex: skill.name,
                    key: skill.name,
                    className: 'classNameOfColumn',
                    render: (text, record) => {
                        return {
                            props: {
                                className: 'classNameOfCell'
                            },
                            children: text
                        };
                    }
                });
                skills.push(skill.name);
            }
        });
    });

    return columns;
}

export {AddSearchColumns};
