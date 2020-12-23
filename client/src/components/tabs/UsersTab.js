import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import UsersTable from '../tables/UsersTable';
import Api from '../../api/siteUrl';
import { UPDATE_USERS, REFRESH_COMPLETE } from '../../actions';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'fixed',
    left: 0,
    padding: isMobileOnly ? '15px 5%' : '18px 10%',
    width: '100%',
    background: 'linear-gradient(to bottom, #202020, transparent)'
    // borderBottom: '1px solid grey'
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    margin: '8px 13px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    width: '100%',
    border: '1px solid white',
    borderRadius: '50px',
    background: '#202020',
    fontSize: '16px'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: '100%'
  }
}));

const UsersTab = ({ usersArray, updateUsers, refreshNeeded, refreshComplete }) => {
  const classes = useStyles();
  const [searchVal, setSearchVal] = useState("");
  useEffect(() => {
    if (refreshNeeded) {
      Api.get('/getAllUsers').then(res => {
        updateUsers(res.data.users);
        refreshComplete();
      });
    }
  }, [refreshNeeded, updateUsers, refreshComplete])
  return (
    <div>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search users..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onChange={e => setSearchVal(e.target.value.toLowerCase())}
        />
      </div>
      <div style={{height: isMobileOnly ? '60px' : '70px'}}/>
      <UsersTable
        users={
          usersArray.filter(user =>
            user.username.toLowerCase().includes(searchVal) ||
            user.firstName.toLowerCase().includes(searchVal) ||
            user.lastName.toLowerCase().includes(searchVal)
          )
        }
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    usersArray: Object.values(state.users),
    refreshNeeded: state.refreshNeeded
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateUsers: users => dispatch({ type: UPDATE_USERS, users }),
    refreshComplete: () => dispatch({ type: REFRESH_COMPLETE })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersTab);