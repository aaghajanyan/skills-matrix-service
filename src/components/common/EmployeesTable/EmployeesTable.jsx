import React from 'react'
import { SMTable } from 'components/common/SMTable/SMTable';

function EmployeesTable(props) {

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'avatar',
            width: '20%',
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

    return <SMTable columns={columns} onRow={onEmployeeSelect} {...props} />
}

export { EmployeesTable };