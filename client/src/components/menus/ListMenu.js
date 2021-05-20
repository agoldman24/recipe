import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Dialog from "@material-ui/core/Dialog";
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
  backdropRoot: {
    display: "none",
  },
  paper: {
    margin: "0",
    width: "100%",
    maxWidth: "none",
    borderRadius: "0",
    background: "linear-gradient(to right, #190023, #3b0031);",
    boxShadow: "0px 10px 20px black",
  },
});

const iconStyle = {
  minWidth: "40px",
};

const ListMenu = ({
  classes,
  isOpen,
  setIsOpen,
  setActiveTab,
  activeUser,
  signOut,
}) => {
  return (
    <Dialog
      open={true}
      style={{
        top: "45px",
        height: "fit-content",
        zIndex: "1301",
      }}
      classes={{
        paper: classes.paper,
      }}
      BackdropProps={{
        classes: {
          root: classes.backdropRoot,
        },
      }}
    >
      <ClickAwayListener
        onClickAway={() => {
          if (isOpen) {
            setIsOpen(false);
          }
        }}
      >
        <List
          disablePadding
          style={{
            height: isOpen ? "185px" : "0",
            transitionProperty: "height",
            transitionDuration: "0.3s",
          }}
          onClick={() => setIsOpen(false)}
        >
          <ListItem button onClick={() => setActiveTab(RECIPE_TAB)}>
            <ListItemIcon style={iconStyle}>
              <MenuBookSharpIcon />
            </ListItemIcon>
            <ListItemText primary="Recipes" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab(USERS_TAB)}>
            <ListItemIcon style={iconStyle}>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem
            button
            onClick={() => setActiveTab(PROFILE_TAB, activeUser)}
          >
            <ListItemIcon style={iconStyle}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={signOut}>
            <ListItemIcon style={iconStyle}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </ClickAwayListener>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTab: state.activeTab,
    recipeCategory: state.recipeCategory,
    isFetchingRecipes: state.isFetchingRecipes,
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    displayUser: state.displayUser,
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
