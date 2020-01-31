import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SMSkillBar} from '../components/SMSkillBar';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Tag} from 'antd'; //TODO : move to common components
import {getSkills} from 'src/services/skillsService';
import {SkillsTable} from '../components/SkillsTable';

library.add(fab, far, fas);

function Skills(props) {

    const dispatch = useDispatch()
    const [skillsLists, setSkillsLists] = useState(null);

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        const allSkillsLists = [];
        getSkills().then((skills) => {
            skills && skills.map((item, index) => {
                let categoriesList = item.categories && item.categories.map(cat => {
                    return <Tag key={cat.name} color={getRandomColor()} className="sm-tag">{cat.name}</Tag>
                });
                const row = {
                    key: index,
                    name: item.name,
                    skill:  <SMSkillBar name={item.name} icon={['fab', 'react']} style={{width: '30px', height: '30px'}} />,
                    categories: categoriesList,
                };
                allSkillsLists.push(row);
            });
            setSkillsLists(allSkillsLists)
        }).catch(error=> {
            console.log("Error to get Skills. ", error);
        })
    }, []);

    const comparator = (a, b) => {
        if(a > b) { return -1; }
        if(a < b) { return 1; }
        return 0;
    };

    const column = [
        {
            title: 'Skill',
            dataIndex: 'skill',
            width: '15%',
            sorter: (a, b) => comparator(a.name, b.name)
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            width: '30%'
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (text, record) =>
                skillsLists.length >= 1 ? (
                    <div style={{cursor: 'not-allowed', opacity: '0.5', width: '100px', paddingLeft: '45px'}}>
                        <span> <FontAwesomeIcon icon={['fas', 'pencil-alt']} style={{width: '20px', height: '20px'}} /> </span>
                        <span> <FontAwesomeIcon icon={['far', 'trash-alt']} style={{width: '20px', height: '20px', marginLeft: '10px'}} /> </span>
                        {/*
                //TODO check if current user is admin
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                </Popconfirm> */}

                    </div>
                ) : null,
            width: '10%'
        }
    ];

    return (
        <SkillsTable skillsLists={skillsLists} column={column}/>
    );
}

export {Skills};
