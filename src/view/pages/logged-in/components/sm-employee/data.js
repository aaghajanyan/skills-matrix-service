import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SMIcon} from 'src/view/components';

library.add(fab, far, fas);

const summary = {
    topInterests: [
        {
            icon: 'android',
            skill: 'Android',
            mark: 5
        },
        {
            icon: 'angular',
            skill: 'Angular JS',
            mark: 5
        },
        {
            icon: 'css3',
            skill: 'CSS',
            mark: 5
        },
        {
            icon: 'python',
            skill: 'Python',
            mark: 5
        },
        {
            icon: 'swift',
            skill: 'Swift',
            mark: 5
        },
        {
            icon: 'react',
            skill: 'React JS',
            mark: 5
        }
    ],

};

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

const categoriesColumns1 = [
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

const categoriesColumns = (list, permission, editModalCallBack, handleDelete, confirmDialog) => [
    {
        title: 'Category',
        dataIndex: 'name',
        className: "table-column-name",
        sorter: (a, b) => comparator(a.name, b.name)
    },
    {
        title: 'Assessment',
        dataIndex: 'assessment',
        className: "table-column-name",
        sorter: (a, b) => comparator(a.assessment, b.assessment),
    },
    {
        title: 'Experience',
        dataIndex: 'experience',
        className: "table-column-name",
        sorter: (a, b) => comparator(a.experience, b.experience),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        className: "table-column-date",
        sorter: (a, b) => comparatorDate(a.date, b.date)
    },
    {
        title: '',
        dataIndex: 'operation',
        className: "table-column-action",
        render: (text, record) =>
            list.length >= 1 ? (
                permission && <>
                    <SMIcon className={'sm-icon-edit'} iconType={'fas'} icon='pencil-alt' onClick={(e) => editModalCallBack(e, record)}/>
                    <SMIcon className={'sm-icon-delete'} iconType={'far'} icon='trash-alt' onClick={(e) => {confirmDialog(handleDelete, e, record)}}/>
                </>
            ) : null,
    }
];

const categorySkillsColumns = (list, permission, editModalCallBack, handleDelete, confirmDialog) => [
    {
        title: 'Skill',
        dataIndex: 'skill',
        className: "table-column-name",
        sorter: (a, b) => comparator(a.skill, b.skill)
    },
    {
        title: 'Assessment',
        dataIndex: 'assessment',
        className: "table-column-name",
        sorter: (a, b) => comparator(a.assesment, b.assesment),
    },
    {
        title: 'Experience',
        dataIndex: 'experience',
        className: "table-column-name",
        sorter: (a, b) => comparator(a.experience, b.experience),
    },
    {
        title: 'Categories',
        dataIndex: 'categories',
        className: "table-column-category",
        width: '5%'

    },
    {
        title: 'Date',
        dataIndex: 'date',
        className: "table-column-date",

        sorter: (a, b) => comparatorDate(a.date, b.date)
    },
    {
        title: '',
        dataIndex: 'operation',
        className: "table-column-action",
        render: (text, record) =>
            list.length >= 1 ? (
                permission && <>
                    <SMIcon className={'sm-icon-edit'} iconType={'fas'} icon='pencil-alt' onClick={(e) => editModalCallBack(e, record)}/>
                    <SMIcon className={'sm-icon-delete'} iconType={'far'} icon='trash-alt' onClick={(e) => {confirmDialog(handleDelete, e, record)}}/>
                </>
            ) : null,
    }
];

export {summary, categorySkillsColumns, categoriesColumns};