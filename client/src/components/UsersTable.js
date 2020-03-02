import React from 'react';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    marginLeft: isMobile ? '5%' : '10%',
    width: isMobile ? '90%' : '80%',
    margin: '125px 0 200px'
  }
});

const UsersTable = props => {
  const classes = useStyles();
  const cellStyle = {fontSize:'16px'};

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {props.users.map(user => (
            <TableRow key={user.id}>
              <TableCell style={cellStyle} component="th" scope="row">
                {user.firstName + " " + user.lastName}
              </TableCell>
              <TableCell style={cellStyle}>{user.username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;