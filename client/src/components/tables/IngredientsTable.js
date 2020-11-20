import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const textStyle = {
  fontSize: '12.5px'
}
const greyTextStyle = {
  ...textStyle,
  color: '#999999'
}

const IngredientsTable = ({ ingredients }) => {
  return (
    <TableContainer component={Paper} style={{boxShadow:'none', background:'none', paddingBottom:'10px'}}>
      <Table size="small">
        <TableHead >
          <TableRow>
            <TableCell style={greyTextStyle}>Item</TableCell>
            <TableCell style={greyTextStyle}>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients.map(({ item, quantity }, index) => (
            <TableRow key={index}>
              <TableCell style={textStyle}>{item}</TableCell>
              <TableCell style={textStyle}>{quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IngredientsTable;