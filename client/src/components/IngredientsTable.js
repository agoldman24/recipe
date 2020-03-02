import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    marginLeft: '5%',
    width: '90%'
  }
});

const IngredientsTable = props => {
  const classes = useStyles();
  const cellStyle = {fontSize:'16px'};

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {props.ingredients.map(ingredient => (
            <TableRow key={ingredient.item}>
              <TableCell style={cellStyle} component="th" scope="row">
                {ingredient.item}
              </TableCell>
              <TableCell style={cellStyle}>{ingredient.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IngredientsTable;