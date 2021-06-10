import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import Drawer from "@material-ui/core/Drawer";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuBookSharpIcon from "@material-ui/icons/MenuBookSharp";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  SET_ACTIVE_TAB,
  CLEAR_ERROR_MESSAGES,
  SIGN_OUT,
  SHOW_SNACKBAR,
  SET_DISPLAY_USER,
  GET_USER_DETAIL_REQUESTED,
  INIT_HYDRATION,
} from "../../actions";
import { RECIPE_TAB, USERS_TAB, PROFILE_TAB } from "../../variables/Constants";

const styles = () => ({
  paper: {
    top: "45px",
    background: "linear-gradient(to right, #190023, #3b0031)",
    borderRight: "1px solid rebeccapurple",
  },
  backdropRoot: {
    top: "45px",
  },
});

const iconStyle = {
  minWidth: "40px",
};

const ListMenu = ({
  classes,
  isOpen,
  setIsOpen,
  setIsSearchVisible,
  setKeyword,
  setActiveTab,
  activeUser,
  isLoggedIn,
  signOut,
}) => {
  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        classes={{ paper: classes.paper }}
        BackdropProps={{
          classes: {
            root: classes.backdropRoot,
          },
        }}
      >
        <List style={{ width: "200px" }}>
          <ListItem
            button
            onClick={() => {
              setIsOpen(false);
              setIsSearchVisible(false);
              setKeyword("");
              setActiveTab(RECIPE_TAB);
            }}
          >
            <ListItemIcon style={iconStyle}>
              <MenuBookSharpIcon />
            </ListItemIcon>
            <ListItemText primary="Recipes" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setIsOpen(false);
              setIsSearchVisible(false);
              setKeyword("");
              setActiveTab(USERS_TAB);
            }}
          >
            <ListItemIcon style={iconStyle}>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          {isLoggedIn && (
            <Fragment>
              <ListItem
                button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab(PROFILE_TAB, activeUser);
                }}
              >
                <ListItemIcon style={iconStyle}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setIsOpen(false);
                  setIsSearchVisible(false);
                  setKeyword("");
                  signOut();
                }}
              >
                <ListItemIcon style={iconStyle}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItem>
            </Fragment>
          )}
        </List>
      </Drawer>
    </ClickAwayListener>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTab: state.activeTab,
    activeUser: state.activeUser,
    isLoggedIn: !!state.activeUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    refresh: () => {
      dispatch({ type: CLEAR_ERROR_MESSAGES });
      dispatch({ type: INIT_HYDRATION });
    },
    setActiveTab: (name, user) => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name },
      });
      if (name === PROFILE_TAB) {
        dispatch({ type: SET_DISPLAY_USER, user });
        dispatch({ type: GET_USER_DETAIL_REQUESTED });
      }
    },
    signOut: () => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name: RECIPE_TAB },
      });
      dispatch({ type: SIGN_OUT });
      dispatch({ type: SHOW_SNACKBAR, message: "You're signed out" });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ListMenu));
