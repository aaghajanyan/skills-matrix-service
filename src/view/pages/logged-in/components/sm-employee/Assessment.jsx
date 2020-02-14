import React from 'react';
import {SMButton, SMTable} from 'src/view/components';
import {categories, categorySkills} from './data';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(fab, far, fas);

function Assessment() {

    const comparator = (a, b) => {
        if(a > b) { return -1; }
        if(a < b) { return 1; }
        return 0;
    };

    const comparatorDate = (a, b) => {
        const date1 = new Date(a);
        const date2 = new Date(b);
        if(date1 > date2) { return -1; }
        if(date1 < date2) { return 1; }
        return 0;
    };

    const categoriesColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '33%',
            sorter: (a, b) => comparator(a.name, b.name)

        },
        {
            title: 'Average',
            dataIndex: 'average',
            width: '33%',
            sorter: (a, b) => comparator(a.average, b.average)
        },
        {
            title: 'Date',
            dataIndex: 'date',
            width: '33%',
            sorter: (a, b) => comparatorDate(a.date, b.date)
        }
    ];

    const categorySkillsColumns = [
        {
            title: 'Skill',
            dataIndex: 'icon',
            width: '5%'
        },
        {
            dataIndex: 'skill',
            width: '15%',
            sorter: (a, b) => comparator(a.skill, b.skill)
        },
        {
            title: 'Assessment',
            dataIndex: 'assesment',
            sorter: (a, b) => comparator(a.assesment, b.assesment),
            width: '20%'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            width: '20%',
            sorter: (a, b) => comparatorDate(a.date, b.date)
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            width: '30%'
        },
        {
            title: '',
            dataIndex: 'operation',
            // TODO use SMIcon
            render: (text, record) =>
                categorySkills.length >= 1 ? (
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
        <React.Fragment>
            <div className="sm-component">
                <h3 className="sm-subheading">Categories</h3>
                <SMTable
                    className="sm-table"
                    columns={categoriesColumns}
                    dataSource={categories}
                    pagination={false}
                />
            </div>
            <div className="sm-component">
                <div className="skills-table-header">
                    <h3 className="sm-subheading" >All Skills</h3>
                    <SMButton className="sm-button"> Add Skill </SMButton>
                </div>
                <SMTable
                    className="sm-table"
                    columns={categorySkillsColumns}
                    dataSource={categorySkills}
                    pagination = {undefined}
                />
            </div>
        </React.Fragment>
    );
}

export {Assessment};