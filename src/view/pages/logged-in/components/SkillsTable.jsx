import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {SMTable} from 'src/view/components';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
library.add(fab, far, fas);
import {SMConfirmModal} from '../../../components/SMConfirmModal';

function SkillsTable(props) {
    let [selectedRowKeys, setSelectedRowKeys ] = useState(null);

    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        hideDefaultSelections: true,
        columnWidth: '10px',
        selections: [
          {
            key: 'delete-all',
            text: 'Delete',
            onSelect: () => {
                SMConfirmModal(props.handleSomeDelete, null, selectedRowKeys)
            },
          }
        ]
    };

    const onSkillSelect = (record, rowIndex) =>({
        onClick: () => {
            if (selectedRowKeys) {
                if (!selectedRowKeys.includes(record.name)){
                    setSelectedRowKeys([...selectedRowKeys, record.name])
                } else {
                    const index = selectedRowKeys.indexOf(record.name);
                    if (index > -1){
                        selectedRowKeys.splice(index, 1);
                        setSelectedRowKeys([...selectedRowKeys]);
                    }
                }
            } else {
                setSelectedRowKeys([record.name])
            }
        }
    });

    return (
        <React.Fragment>
            <div className="sm-component sm-component-skill">
                <div className="skills-table-header">
                    <h3 className="sm-subheading" >All Skills</h3>
                    <div className="skills-table-header-items">
                        {props.items}
                    </div>
                </div>
                <div className="skills-table-header-search">
                        {props.searchBar}
                </div>

                <SMTable
                    className="sm-table sm-table-skill"
                    columns={props.column}
                    dataSource={props.skillsDataSource}
                    pagination={{ showQuickJumper: true, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['3', '5', '10', '100']}}
                    rowSelection={rowSelection}
                    onRow={onSkillSelect}
                    scroll={{ y: 625 }}
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
