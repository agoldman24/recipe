import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import '../index.css';
import { SET_DISPLAY_USER, SET_ACTIVE_TAB, GET_USER_DETAIL_REQUESTED } from '../actions';
import { PROFILE_TAB, FOLLOWERS, PUSH } from '../variables/Constants';

const useStyles = makeStyles({
  table: {
    marginLeft: isMobile ? '5%' : '10%',
    width: isMobile ? '90%' : '80%'
  }
});

const textStyle = {
  fontSize: '16px',
  float:'left'
}

const UsersTable = props => {
  const classes = useStyles();
  const [selectedId, setSelectedId] = React.useState(0);

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {props.users.map(user => (
            <TableRow
              key={user.id}
              className="clickable"
              selected={selectedId === user.id}
              onClick={() => {
                setSelectedId(user.id);
                props.visitUserProfile(user, props.activeTab, props.displayUser);
              }}>
              <TableCell component="th" scope="row">
                <Typography style={textStyle}>{user.firstName + " " + user.lastName}</Typography>
                <Typography style={{...textStyle, color:'grey', paddingLeft:'10px'}}>{user.username}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    displayUser: state.displayUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    visitUserProfile: (user, currentTab, displayUser) => {
      dispatch({ type: SET_DISPLAY_USER, user });
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: {
          name: currentTab.name,
          displayUserId: !!displayUser ? displayUser.id : null
        },
        newTab: { name: PROFILE_TAB },
        operation: PUSH
      });
      dispatch({ type: GET_USER_DETAIL_REQUESTED, activeDetail: FOLLOWERS });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersTable);