import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import UsersTable from '../tables/UsersTable';
import Api from '../../api/siteUrl';
import { UPDATE_USERS, REFRESH_COMPLETE } from '../../actions';

const searchIcon = {
  position: 'absolute',
  zIndex: 2,
  pointerEvents: 'none',
  margin: '5px 10px',
  alignItems: 'center',
  justifyContent: 'center'
}

const inputRoot = {
  borderRadius: '50px',
  fontSize: '16px',
  fontFamily: 'Signika',
  position: 'fixed',
  top: '5px',
  maxWidth: '40%'
}

const useStyles = makeStyles(theme => ({
  search: {
    position: 'fixed',
    top: '5px',
    marginLeft: '5px'
  },
  searchIcon: {
    ...searchIcon,
    color: 'grey'
  },
  focusedSearchIcon: {
    ...searchIcon,
    color: 'white'
  },
  inputRoot: {
    ...inputRoot,
    border: '1px solid grey'
  },
  focusedInputRoot: {
    ...inputRoot,
    border: '1px solid white'
  },
  inputInput: {
    padding: '5px 35px'
  }
}));

const UsersTab = ({ usersArray, updateUsers, refreshNeeded, refreshComplete }) => {
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
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
    <Fragment>
      <div className={classes.search}>
        <div className={isFocused ? classes.focusedSearchIcon : classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search users..."
          classes={{
            root: isFocused ? classes.focusedInputRoot : classes.inputRoot,
            input: classes.inputInput,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={e => setSearchVal(e.target.value.toLowerCase())}
        />
      </div>
      <UsersTable
        users={
          usersArray.filter(user =>
            user.username.toLowerCase().includes(searchVal) ||
            user.firstName.toLowerCase().includes(searchVal) ||
            user.lastName.toLowerCase().includes(searchVal)
          )
        }
      />
    </Fragment>
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