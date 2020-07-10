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
    headerStyle: { color: "#fff78c", fontSize: 16 }
  }
});

const IngredientsTable = ({ tableRef, ingredients, isEditable, addRowMode }) => {
  const classes = useStyles();

  let editable = !isEditable ? null : {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        resolve();
      }),
    onRowDelete: (newData, oldData) =>
      new Promise((resolve, reject) => {
        resolve();
      })
  };
  if (isEditable && addRowMode) {
    tableRef.current.state.showAddRow = true;
    editable = {
      ...editable,
      onRowAdd: (newData, oldData) =>
        new Promise((resolve, reject) => {
          resolve();
        }),
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
        console.log(props);
        return <TextField
          value={props.value}
          label={props.columnDef.title}
          onChange={event => props.onChange(event.target.value)}
          style={{
            width: isMobile ? '150px' : '250px'
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
        rowStyle: {
          fontSize: 16,
          width: 250
        }
      }}
      style={{
        padding: isMobile ? '0': '0 20px'
      }}
    />
  );
}

export default IngredientsTable;