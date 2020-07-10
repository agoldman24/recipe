import React from 'react';
import MaterialTable from "material-table";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

const columns = [
  { title: "Item", field: "item" },
  { title: "Quantity", field: "quantity" }
].map(column => {
  return {
    ...column,
    headerStyle: { color: "#fff78c", fontSize: 16 }
  }
});

const IngredientsTable = ({ ingredients, isEditable }) => {
  return (
    <MaterialTable
      title={""}
      columns={columns}
      data={ingredients}
      editable={!isEditable ? null : {
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            resolve();
          }),
        onRowDelete: (newData, oldData) =>
          new Promise((resolve, reject) => {
            resolve();
          })
      }}
      components={{
        Container: props => <Paper {...props} elevation={0}/>,
        EditField: props => <TextField
          value={props.value}
          onChange={event => props.onChange(event.target.value)}
          style={{width:'250px'}}
        />
      }}
      localization={{
        header: {
          actions: ""
        }
      }}
      options={{
        toolbar: false,
        paging: false,
        rowStyle: {
          fontSize: 16,
          width: 250
        }
      }}
      style={{
        padding: '0 20px'
      }}
    />
  );
}

export default IngredientsTable;