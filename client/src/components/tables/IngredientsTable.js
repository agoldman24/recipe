import React from 'react';
import MaterialTable, { MTableHeader, MTableAction } from "material-table";
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
  tableRef,
  ingredients,
  isEditable,
  editRowMode,
  addRowMode,
  toggleEditRowMode,
  toggleAddRowMode,
  toggleModal
}) => {
  let editable = !isEditable ? null : {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        toggleEditRowMode();
        resolve();
      }),
    onRowUpdateCancelled: (newData, oldData) =>
      new Promise((resolve, reject) => {
        toggleEditRowMode();
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
        Header: props => isEditable ? null : <MTableHeader {...props}/>,
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
        ),
        Action: props => {
          const element = typeof props.action === "function" ? props.action(props.data) : props.action;
          return editRowMode
          ? <MTableAction {...props}/>
          : <Button
              style={{padding:'12px', minWidth:'0'}}
              disabled={addRowMode && !(element.tooltip === "Save" || element.tooltip === "Cancel")}
            >
              {element.tooltip === "Edit"
              ? <CreateIcon
                  onClick={event => {
                    element.onClick(event, props.data);
                    toggleEditRowMode();
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
        width: '100%',
        padding: isEditable ? '0' : '0 20px'
      }}
    />
  );
}

export default IngredientsTable;