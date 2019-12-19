import React from 'react'
import PropTypes from "prop-types"
import { SMTable } from 'components/common/SMTable/SMTable';

function EmployeesTable(props) {

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'avatar',
            width: '33%',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            width: '33%',
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            width: '33%',
        }
    ];

    const onEmployeeSelect = (record, rowIndex) => ({
        onClick: () => props.history.push(`employees/${record.guid}`)
    })

    return <SMTable columns={columns} onRow={onEmployeeSelect} {...props} />
}

EmployeesTable.propTypes = {
    history: PropTypes.object.isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    loading: PropTypes.bool,
    showHeader: PropTypes.bool,
    pagination: PropTypes.bool,
}

export { EmployeesTable };