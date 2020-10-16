import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import {
  SIGN_OUT,
  SET_DISPLAY_USER,
  SET_ACTIVE_TAB,
  SHOW_SNACKBAR,
  GET_USER_DETAIL_REQUESTED,
  TOGGLE_DRAWER_MENU
} from '../../actions';
import { WELCOME_TAB, PROFILE_TAB, FOLLOWERS } from '../../variables/Constants';

const useStyles = makeStyles({
  list: {
    width: 220,
    paddingTop: '50px',
    backgroundColor: '#303030',
    height: '100%'
  },
  listItem: {
    marginLeft: '10px'
  },
  listItemText: {
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Raleway'
  }
});

const DrawerMenu = props => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    if (open) {
      setOpen(false);
      setTimeout(() => props.toggleDrawerMenu(), 1);
    } else {
      props.toggleDrawerMenu();
      setTimeout(() => setOpen(true), 1);
    }
  };

  const clickHandler = text => {
    switch (text) {
      case "Profile":
        props.visitUserProfile(props.activeUser);
        break;
      case "Create":
        props.toggleCreateMode();
        break;
      case "Sign Out":
        props.signOut();
        break;
      default:
        break;
    }
  }

  const getIcon = text => {
    switch (text) {
      case "Profile":
        return <PersonIcon />
      case "Create":
        return <CreateIcon />;
      case "Sign Out":
        return <ExitToAppIcon />;
      default:
        return null;
    }
  }

  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
        {['Profile', 'Create', 'Sign Out']
        .map(text => (
          <ListItem
            button
            key={text}
            className={classes.listItem}
            onClick={() => clickHandler(text)}
          >
            <ListItemIcon>{getIcon(text)}</ListItemIcon>
            <ListItemText primary={text} classes={{primary:classes.listItemText}}/>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div style={{display:'flex'}}>
      <Button
        style={{
          width:'33.33vw',
          fontSize:'13px',
          height:'50px',
          borderRadius:'0',
          borderBottom: props.activeUserProfile ? '2px solid #ffe100' : 'none',
          color: props.activeUserProfile ? '#ffe100' : 'white',
          opacity: open || props.activeUserProfile ? '1.0' : '0.7',
          background: open
            ? 'linear-gradient(black, #303030)'
            : 'linear-gradient(black, #202020)'
        }}
        startIcon={<AccountCircleIcon />}
        onClick={toggleDrawer}
      >
        {props.activeUser.firstName}
      </Button>
      {props.isDrawerMenuVisible &&
        <SwipeableDrawer
          style={{zIndex:'3'}}
          anchor="right"
          open={open}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
        >
          {sideList()}
        </SwipeableDrawer>
      }
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isDrawerMenuVisible: state.isDrawerMenuVisible,
    activeUser: state.activeUser,
    activeUserProfile: state.activeTab.name === PROFILE_TAB
      && !!state.activeUser && !!state.displayUser
      && state.activeUser.id === state.displayUser.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleDrawerMenu: () => dispatch({ type: TOGGLE_DRAWER_MENU }),
    visitUserProfile: user => {
      dispatch({ type: SET_DISPLAY_USER, user })
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name: PROFILE_TAB }
      });
      dispatch({ type: GET_USER_DETAIL_REQUESTED, activeDetail: FOLLOWERS });
    },
    signOut: () => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name: WELCOME_TAB }
      });
      dispatch({ type: SIGN_OUT });
      dispatch({ type: SHOW_SNACKBAR, message: "You're signed out" });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerMenu);