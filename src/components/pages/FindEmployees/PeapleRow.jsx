import React, {useState} from 'react';
import {AddPeapleRow} from 'components/pages/FindEmployees/AddPeapleRow';

function PeapleRow (props) {

    const [rowSelect, setRowSelect] = useState()

    const handleChange = (item) => {
        setRowSelect(item);
    }

    return (
        <>
          <AddPeapleRow form={props.form}
            dataFields={props.dataFields} rowIndex1={props.rowIndex1} rowSelect={handleChange} addSelectField={props.addSelectField} criteriaValue={props.criteriaValue} rows={props.rows} onRowDel={props.onRowDel} cellData={{
            id: props.rows.id,
            criteriaValue: rowSelect,
            value: []
          }}/>
        </>
      );
}

export {PeapleRow}