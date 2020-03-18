import React from 'react';
import PropTypes from 'prop-types';
import {SMTable} from '../../../components';

function EmployeesTable(props) {


    const comparator = (a, b) => {
        if(a > b) { return -1; }
        if(a < b) { return 1; }
        return 0;
    };

    const data = [];

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'avatar',
            width: '33%',
            sorter: (a, b) => comparator(a.fname, b.fname)
        },
        {
            title: 'Position',
            dataIndex: 'position',
            width: '33%',
            sorter: (a, b) => comparator(a.position, b.position)
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            width: '33%',
            sorter: (a, b) => comparator(a.branchName, b.branchName)
        }
    ];

    const onEmployeeSelect = (record, rowIndex) => ({
        onClick: () => props.history.push(`employees/${record.guid}`)
    });

    const addDataSource = () => {
        props.dataSource && props.dataSource.map((item, index) => {
            const row = {
                key: index,
                avatar: item.avatar,
                position: item.position.name,
                branchName: item.branch.name,
                guid: item.guid
            };
            data.push(row);
        });
        return data;
    };

    return (
        <div className={props.className}>
            <h3 className="sm-subheading"> Employees </h3>
            <div className='skills-table-header-search'>
                {props.searchBar}
            </div>
            <SMTable columns={columns} dataSource={addDataSource()} onRow={onEmployeeSelect} className={null}/>
        </div>
    );
}

EmployeesTable.propTypes = {
    history: PropTypes.object.isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    loading: PropTypes.bool,
    showHeader: PropTypes.bool,
    pagination: PropTypes.bool
};

export {EmployeesTable};