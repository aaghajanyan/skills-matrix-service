import React, {useLayoutEffect} from 'react';

function AddSearchColumns(props) {

    let skills = [];

    let skillsNames = []; 
    props.userData.map((item, index) => {
        item.skills.map( skill => {
            if(!skillsNames.includes(skill.name)) {
                skillsNames.push(skill);
            }
        });
    });

    const countOfMinColumns = 3;
    const count = skillsNames.length;

    let columns = [
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

    if(count <= countOfMinColumns) {
        const newColumns = columns.map( column => {
            count === 0 ? delete column.width : column.width = `${100 / (count+columns.length) }%`;
            delete column.fixed;
            return column;
        });
                
        if (count === 0) {
            return (newColumns);
        }
        columns = newColumns ;
    }

    props.userData.map((item) => {
        return item.skills.map( (skill, index) => {
            if(!skills.includes(skill.name)) {
                columns.splice(2, 0, {
                    title: skill.name,
                    dataIndex: skill.name,
                    key: skill.name,
                    className: (count > countOfMinColumns ? 'classNameOfColumnMany' : 'classNameOfColumn'),
                    render: (text, record) => {
                        return {
                            props: {
                                className:  (count > countOfMinColumns ? 'classNameOfCellMany' : 'classNameOfCell')
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
