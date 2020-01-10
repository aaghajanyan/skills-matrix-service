import React, { useState, useEffect } from 'react';
import { AddPeopleRow } from './AddPeopleRow/AddPeopleRow';
import { getUsers } from 'store/actions/search';
import { useDispatch } from 'react-redux';

function PeopleRow(props) {

  const [rowSelect, setRowSelect] = useState()
  const dispatch = useDispatch();
  const handleChange = (item) => {
    if (item) {
      setRowSelect(item);
      dispatch(getUsers(props.formItem.getFieldsValue()))
    }

  }

  return (
    <>
      <AddPeopleRow
        formItem={props.formItem}
        rowIndex={props.rowIndex}
        rowSelect={handleChange}
        addSelectField={props.addSelectField}
        criteriaValue={props.criteriaValue}
        rows={props.rows}
        onRowDel={props.onRowDel}
        cellData={{
          id: props.rows.id,
          criteriaValue: (props.fieldsValue && props.fieldsValue[props.rows.id]) ? props.fieldsValue[props.rows.id].type : rowSelect,
        }}
      />
    </>
  );
}

export { PeopleRow }