import React from 'react';
import MaterialTable from "material-table";
import Paper from "@material-ui/core/Paper";

const columns = [
  { title: "Item", field: "item" },
  { title: "Quantity", field: "quantity" }
].map(column => {
  return {
    ...column,
    headerStyle: { color: '#ffaa16' , fontSize: 16, padding: '10px 5px' },
    cellStyle: { padding: '5px' }
  }
});

const IngredientsTable = ({ ingredients }) => {
  return (
    <MaterialTable
      columns={columns}
      data={ingredients}
      editable={null}
      components={{
        Container: props => <Paper {...props} elevation={0}/>
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
        width: '100%',
        padding: '0 20px'
      }}
    />
  );
}

export default IngredientsTable;