import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SMIcon} from 'src/view/components';
import { Popconfirm } from 'antd';

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
        // TODO use SMIcon
        render: (text, record) =>
        list.length >= 1 ? (
                <div style={{cursor: 'not-allowed', opacity: '0.5', width: '100px', paddingLeft: '45px'}}>
                    {
                        {permission} &&
                        <>
                            <SMIcon className={'refresh-btn'} iconType={'fas'} icon={'pencil-alt'} style={{width: '20px', height: '20px'}} onClick={() => editModalCallBack(record)}/>
                            <SMIcon onClick={() => {confirmDialog(handleDelete, record)}} className={'refresh-btn'} iconType={'fas'} icon={'trash-alt'} style={{width: '20px', height: '20px'}}/>
                        </>
                    }
                </div>
            ) : null,
        width: '10%'
    }
];

export {getColumnData};