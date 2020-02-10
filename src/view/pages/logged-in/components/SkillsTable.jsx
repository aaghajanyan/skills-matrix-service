import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {SMTable} from 'src/view/components';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
library.add(fab, far, fas);

function SkillsTable(props) {
    const [selectedRowKeys, setSelectedRowKeys ] = useState(null);

    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'delete-all',
            text: 'Delete',
            onSelect: () => {props.handleSomeDelete(selectedRowKeys)},
          }
        ]
    };

    const onSkillSelect = (record, rowIndex) =>({
        onClick: () => selectedRowKeys ? setSelectedRowKeys([...selectedRowKeys, record.name]) : setSelectedRowKeys([record.name])
    });

    return (
        <React.Fragment>
            <div className="sm-component sm-component-skill">
                <div className="skills-table-header">
                    <h3 className="sm-subheading" >All Skills</h3>
                    <div className="skills_add-skills-container">
                        {props.items}
                    </div>
                </div>

                <SMTable
                    className="sm-table sm-table-skill"
                    columns={props.column}
                    dataSource={props.skillsDataSource}
                    pagination={{ showQuickJumper: true, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['3', '5', '10', '100']}}
                    rowSelection={rowSelection}
                    onRow={onSkillSelect}
                />
            </div>
        </React.Fragment>
    );
}

SMTable.propTypes = {
    refreshTable: PropTypes.func,
    skillsDataSource: PropTypes.object,
    column: PropTypes.object,
    handleSomeDelete: PropTypes.func
};

export {SkillsTable};
