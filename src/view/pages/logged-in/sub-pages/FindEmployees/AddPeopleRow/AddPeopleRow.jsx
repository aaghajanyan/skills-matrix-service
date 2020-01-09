import React from 'react';
import { RelationView } from './RelationView';
import { SelectRowView } from './SelectRowView';


function AddPeopleRow(props) {
    return (
        <>
            <RelationView rowIndex={props.rowIndex} formItem={props.formItem} cellData={props.cellData} />
            <SelectRowView
                selectCriteriaValue={props.criteriaValue}
                rowSelect={props.rowSelect}
                rowIndex={props.rowIndex}
                cellData={props.cellData}
                addSelectField={props.addSelectField}
                onRowDel={props.onRowDel}
                formItem={props.formItem}
            />
        </>
    )
}

export { AddPeopleRow }