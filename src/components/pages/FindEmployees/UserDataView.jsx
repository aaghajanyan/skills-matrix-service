import React from 'react';

import { SMUserBar } from 'components/common/SMUserBar/SMUserBar';
import { SMTable } from 'components/common/SMTable/SMTable';

function UserDataView(props){

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fname',
            width: '20%',
            render: (_, record) => <SMUserBar avatarUrl={record.avatarUrl} firstName={record.fname} lastName={record.lname} size='medium'/>
        },
        {
            title: 'Position',
            dataIndex: 'position',
            width: '20%',
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            width: '20%',
        }
    ];

    const onEmployeeSelect = (record, rowIndex) => ({
        onClick: () => props.history.push(`employees/${record.guid}`)
    })

    return (
        <SMTable
            key={props.index}
            className='sm-table employees-table'
            onRow={onEmployeeSelect}
            loading={!props.userData}
            columns={columns}
            showHeader={true}
            dataSource={props.userData}
            pagination={false}>
        </SMTable>
    );
}

export {UserDataView}