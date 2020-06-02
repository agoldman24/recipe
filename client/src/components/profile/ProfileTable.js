import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import '../../index.css';
import { UPDATE_PROFILE_EDITOR } from '../../actions';
import { formTheme } from '../../styles';

const useStyles = makeStyles(formTheme);

const cellStyle = {
  padding: '5px',
  borderBottom: 'none'
};

const textStyle = {
  fontFamily: 'Signika',
  fontSize: '16px',
  float:'left',
  width:'80px'
};

const ProfileTable = props => {
  const classes = useStyles();
  const [firstName, setFirstName] = React.useState(props.activeUser.firstName);
  const [lastName, setLastName] = React.useState(props.activeUser.lastName);
  const [username, setUsername] = React.useState(props.activeUser.username);

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell style={cellStyle}>
              <Typography style={textStyle}>First Name</Typography>
            </TableCell>
            <TableCell style={cellStyle}>
              <TextField
                InputProps={{
                  classes: {
                    input: classes.inputText
                  }
                }}
                variant="outlined"
                value={firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                  props.updateFirstName(e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={cellStyle}>
              <Typography style={textStyle}>Last Name</Typography>
            </TableCell>
            <TableCell style={cellStyle}>
              <TextField
                InputProps={{
                  classes: {
                    input: classes.inputText
                  }
                }}
                variant="outlined"
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value);
                  props.updateLastName(e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={cellStyle}>
              <Typography style={textStyle}>Username</Typography>
            </TableCell>
            <TableCell style={cellStyle}>
              <TextField
                InputProps={{
                  classes: {
                    input: classes.inputText
                  }
                }}
                variant="outlined"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  props.updateUsername(e.target.value);
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateFirstName: firstName => dispatch({ type: UPDATE_PROFILE_EDITOR, firstName }),
    updateLastName: lastName => dispatch({ type: UPDATE_PROFILE_EDITOR, lastName }),
    updateUsername: username => dispatch({ type: UPDATE_PROFILE_EDITOR, username })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTable);