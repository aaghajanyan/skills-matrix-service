import React, {useState} from 'react';
import {AddPeopleRow} from './AddPeopleRow/AddPeopleRow';

function PeopleRow(props) {

    const [rowSelect, setRowSelect] = useState()

    const handleChange = (item) => {
        setRowSelect(item);
    }

    return (
        <>
            <AddPeopleRow
              formItem={props.formItem}
              dataFields={props.dataFields}
              rowIndex={props.rowIndex}
              rowSelect={handleChange}
              addSelectField={props.addSelectField}
              criteriaValue={props.criteriaValue}
              rows={props.rows}
              onRowDel={props.onRowDel}
              cellData={{
                id: props.rows.id,
                criteriaValue: rowSelect,
              }}
            />
        </>
      );
}

export {PeopleRow}