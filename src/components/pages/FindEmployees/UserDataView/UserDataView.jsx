import React from 'react';
import { AddColumns } from 'components/pages/FindEmployees/UserDataView/AddColumns';
import { AddDataInColumns } from 'components/pages/FindEmployees/UserDataView/AddDataInColumns';
import { SMTable } from 'components/common/SMTable/SMTable';

function UserDataView(props){

    const onEmployeeSelect = (record, rowIndex) => ({
        onClick: () => props.history.push(`employees/${record.guid}`)
    });

    return (
        <SMTable
            history={props.history}
            columns={AddColumns({userData: props.userData})}
            className='sm-table employees-table employees-table'
            loading={!props.userData}
            showHeader={true}
            dataSource={AddDataInColumns({userData: props.userData})}
            pagination={false}
            onRow={onEmployeeSelect}
            scroll={{ x: 1300}}
            bordered
            />
    );
}

export {UserDataView}