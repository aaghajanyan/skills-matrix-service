import React from 'react';
import {AddSearchColumns} from './AddSearchColumns';
import {SkillsColumns} from './SkillsColumns';
import {SMTable} from 'view/components';

function SearchDataView(props) {

    const onEmployeeSelect = (record) => ({
        onClick: () => props.history.push(`/employees/${record.guid}`)
    });

    return (
        <SMTable
            history={props.history}
            columns={AddSearchColumns({userData: props.userData})}
            className="sm-table employees-table"
            loading={!props.userData}
            showHeader={true}
            dataSource={SkillsColumns({userData: props.userData})}
            pagination={undefined}
            onRow={onEmployeeSelect}
            scroll={{x: 1300}}
            bordered
        />
    );
}

export {SearchDataView};