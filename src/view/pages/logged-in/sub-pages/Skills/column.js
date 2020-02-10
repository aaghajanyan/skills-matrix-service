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

const getDataSource = (list, permission, editModalCallBack, handleDelete, confirmDialog) =>
 [
    {
        title: '',
        key: 'index',
        className: "table-column-numbering",
        render: (text, record, index) => index+1,
    },
    {
        title: 'Skill',
        dataIndex: 'skill',
        className: "table-column-skill",
        sorter: (a, b) => comparator(a.name, b.name)
    },
    {
        title: 'Categories',
        dataIndex: 'categories',
        className: "table-column-category",
    },
    {
        title: '',
        dataIndex: 'operation',
        className: "table-column-action",
        // TODO use SMIcon
        render: (text, record) =>
        list.length >= 1 ? (
                <div style={{wordWrap: 'no-word'}} className='table-action-area'>
                    {
                        {permission} &&
                        <>
                            <SMIcon className={'sm-icon-edit'} iconType={'fas'} icon={'pencil-alt'} onClick={() => editModalCallBack(record)}/>
                            <SMIcon className={'sm-icon-delete'} iconType={'far'} icon={'trash-alt'} onClick={() => {confirmDialog(handleDelete, record)}}/>
                        </>
                    }
                </div>
            ) : null,
    }
];

export {getDataSource};