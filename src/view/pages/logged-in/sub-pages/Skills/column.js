import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SMIcon} from 'src/view/components';

library.add(fab, far, fas);

const comparator = (a, b) => {
    if(a > b) { return -1; }
    if(a < b) { return 1; }
    return 0;
};

const getColumnData = (list, permission, editModalCallBack, handleDelete, confirmDialog) =>
 [
    {
        title: 'Skill',
        dataIndex: 'skill',
        width: '30%',
        className: "table-column-skill",

        sorter: (a, b) => comparator(a.name, b.name)
    },
    {
        title: 'Categories',
        dataIndex: 'categories',
        width: '40%',
        minWidth: '100px',
        className: "table-column-category",
    },
    {
        title: '',
        dataIndex: 'operation',
        // TODO use SMIcon
        render: (text, record) =>
        list.length >= 1 ? (
                <div style={{wordWrap: 'no-word'}} className='table-action-area'>
                    {
                        {permission} &&
                        <>
                            <SMIcon className={'sm-icon-edit'} iconType={'fas'} icon={'pencil-alt'} style={{width: '45px', height: '20px'}} onClick={() => editModalCallBack(record)}/>
                            <SMIcon className={'sm-icon-delete'} iconType={'fas'} icon={'trash-alt'} style={{width: '45px', height: '20px'}} onClick={() => {confirmDialog(handleDelete, record)}}/>
                        </>
                    }
                </div>
            ) : null,
        width: '5%'
    }
];

export {getColumnData};