import React from 'react';
import { isMobile } from 'react-device-detect';
import MaterialTable from "material-table";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import { formTheme } from '../../styles';

const useStyles = makeStyles(formTheme);

const columns = [
  { title: "Item", field: "item" },
  { title: "Quantity", field: "quantity" }
].map(column => {
  return {
    ...column,
    headerStyle: { color: '#ffaa16' , fontSize: 16 }
  }
});

const IngredientsTable = ({
  tableRef, ingredients, isEditable, addRowMode, toggleAddRowMode
}) => {
  const classes = useStyles();

  let editable = !isEditable ? null : {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        resolve();
      }),
    onRowDelete: oldData =>
      new Promise((resolve, reject) => {
        resolve();
      })
  };
  if (isEditable && addRowMode) {
    tableRef.current.state.showAddRow = true;
    editable = {
      ...editable,
      onRowAdd: newData =>
        new Promise((resolve, reject) => {
          toggleAddRowMode();
          resolve();
        }),
      onRowAddCancelled: () => toggleAddRowMode()
    }
  }
  return (
    <MaterialTable
      tableRef={tableRef}
      columns={columns}
      data={ingredients}
      editable={editable}
      components={{
        Container: props => <Paper {...props} elevation={0}/>,
        EditField: props => {
        return <TextField
          value={props.value}
          label={props.columnDef.title}
          onChange={event => props.onChange(event.target.value)}
          style={{
            width: isMobile ? '100px' : '250px'
          }}
          InputProps={{
            classes: {
              input: classes.inputText
            }
          }}
        />
        }
      }}
      localization={{
        header: {
          actions: ""
        }
      }}
      options={{
        toolbar: false,
        paging: false,
        addRowPosition: 'first',
        maxBodyHeight: '500px',
        rowStyle: {
          fontSize: 16,
          width: 250
        }
      }}
      style={{
        width: '100%',
        padding: isMobile || isEditable ? '0': '0 20px'
      }}
    />
  );
}

export default IngredientsTable;