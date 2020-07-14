import React from 'react';
import { isMobile } from 'react-device-detect';
import MaterialTable, { MTableAction } from "material-table";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button"
import CreateIcon from "@material-ui/icons/Create";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { DELETE_INGREDIENT } from '../../actions';

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

const IngredientsTable = ({
  tableRef, ingredients, isEditable, addRowMode, toggleAddRowMode, toggleModal
}) => {
  const [editingRow, setEditingRow] = React.useState(false);

  let editable = !isEditable ? null : {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        setEditingRow(false);
        resolve();
      }),
    onRowUpdateCancelled: (newData, oldData) =>
      new Promise((resolve, reject) => {
        setEditingRow(false);
        resolve();
      }),
    onRowDelete: oldData =>
      new Promise((resolve, reject) => {
        setEditingRow(false);
        resolve();
      }),
    onRowDeleteCancelled: oldData =>
      new Promise((resolve, reject) => {
        setEditingRow(false);
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
        Action: props => {
          const element = typeof props.action === "function" ? props.action(props.data) : props.action;
          return editingRow
          ? <MTableAction {...props}/>
          : <Button style={{padding:'12px', minWidth:'0'}}>
              {element.tooltip === "Edit"
              ? <CreateIcon
                  onClick={event => {
                    element.onClick(event, props.data);
                    setEditingRow(true);
                  }}
                />
              : element.tooltip === "Delete"
                ? <DeleteOutlineIcon
                    onClick={() => toggleModal(
                      DELETE_INGREDIENT,
                      {
                        index: props.data.index,
                        item: props.data.item
                      }
                    )}
                  />
                : element.tooltip === "Save"
                  ? <CheckIcon
                      onClick={event => {
                        element.onClick(event, props.data);
                      }}
                    />
                  : <CloseIcon
                      onClick={event => {
                        element.onClick(event, props.data);
                      }}
                    />
              }
            </Button>
        },
        EditField: props => (
          <Input
            value={props.value}
            placeholder={props.columnDef.title}
            onChange={event => props.onChange(event.target.value)}
            style={{
              width: '140px',
              fontSize: '16px'
            }}
          />
        )
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
        maxBodyHeight: isMobile ? 'none' : '240px',
        rowStyle: {
          fontSize: 16,
          width: 250
        }
      }}
      style={{
        width: '100%',
        padding: isEditable ? '0' : '0 10px 0 20px'
      }}
    />
  );
}

export default IngredientsTable;