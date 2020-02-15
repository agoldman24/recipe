import React from 'react';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    marginLeft: isMobile ? '5%' : '10%',
    width: isMobile ? '90%' : '80%',
    marginTop: '100px'
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    width: '100%',
    outline: '1px solid white',
    fontSize: '16px'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%'
  }
}));

const SearchTab = props => {
  const classes = useStyles();
  return (
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
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
}

export default SearchTab;