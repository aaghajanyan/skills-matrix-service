import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {SMTable} from 'src/view/components';
import classNames from "classnames";

import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
library.add(fab, far, fas);
import {SMConfirmModal} from '../../../components/SMConfirmModal';

function CriteriaTable(props) {
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

    const classes = classNames(
        'sm-table', props.className
    );

    return (
        <React.Fragment>
            <div className='sm-component sm-component-skill'>
                <div className='skills-table-header'>
                <h3 className='sm-subheading sm-table-subheading' > {props.title} </h3>
                    <div className='skills-table-header-items'>
                        {props.items}
                    </div>
                </div>
                <div className='skills-table-header-search'>
                        {props.searchBar}
                </div>

                <SMTable
                    className = {classes}
                    columns = {props.column}
                    dataSource ={props.dataSource}
                    pagination = { props.addPagination ? {showQuickJumper: true, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['3', '5', '10', '100']} : undefined }
                    rowSelection = {props.addCheckbox ? rowSelection : undefined}
                    onRow = {props.addClickableOnRow ? onSkillSelect : undefined}
                    scroll = {props.addScroll ? { y: 600 } : undefined}
                />
            </div>
        </React.Fragment>
    );
}

CriteriaTable.propTypes = {
    title: PropTypes.string,
    dataSource: PropTypes.array,
    column: PropTypes.array,
    handleSomeDelete: PropTypes.func,
    className: PropTypes.string,
    addPagination: PropTypes.bool,
    addCheckbox: PropTypes.bool,
    addClickableOnRow: PropTypes.bool,
    addScroll: PropTypes.bool,
};

export {CriteriaTable};
