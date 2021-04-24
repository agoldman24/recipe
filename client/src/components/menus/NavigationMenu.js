import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import MenuBookSharpIcon from "@material-ui/icons/MenuBookSharp";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import PromptModal from "../popups/PromptModal";
import { defaultTheme } from "../../styles";
import "../../index.css";
import {
  SET_ACTIVE_TAB,
  CLEAR_ERROR_MESSAGES,
  SIGN_OUT,
  SHOW_SNACKBAR,
  SET_DISPLAY_USER,
  GET_USER_DETAIL_REQUESTED,
  INIT_HYDRATION,
} from "../../actions";
import {
  SEARCH,
  CREATE_RECIPE,
  RECIPE_TAB,
  USERS_TAB,
  PROFILE_TAB,
  WELCOME_TAB,
} from "../../variables/Constants";

const inputRoot = {
  fontSize: "16px",
  fontFamily: "Signika",
  borderRadius: "50px",
  position: "fixed",
  top: "8px",
};

const styles = () => ({
  opaque: {
    opacity: "100%",
  },
  transparent: {
    opacity: "0",
  },
  inputRoot: {
    ...inputRoot,
    border: "2px solid white",
  },
  focusedInputRoot: {
    ...inputRoot,
    border: "2px solid " + defaultTheme.palette.primary.main,
  },
  inputInput: {
    padding: "3px 10px",
  },
  dialogRoot: {
    height: "40px",
  },
  dialogContainer: {
    position: "fixed",
    height: "20px",
  },
  dialogPaper: {
    marginLeft: "40px",
    overflowY: "initial",
  },
  backdropRoot: {
    background: "none",
    height: "40px",
  },
});

const NavigationMenu = (props) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);

  const tabStyle = (tab) => ({
    minWidth: "40px",
    minHeight: "40px",
    opacity: isSearchVisible ? "0%" : "100%",
    transitionProperty: "opacity",
    transitionDuration: "0.5s",
    color:
      tab === props.activeTab.name && props.highlightedTab
        ? defaultTheme.palette.primary.main
        : "white",
  });

  const onChangeTab = (event, newValue) => {
    props.clearErrorMessages();
    switch (newValue) {
      case SEARCH:
        setIsSearchVisible(true);
        break;
      case CREATE_RECIPE:
        props.toggleCreateMode();
        break;
      case SIGN_OUT:
        setIsSignOutModalVisible(true);
        break;
      default:
        props.setActiveTab(newValue, props.activeUser);
        break;
    }
  };

  return props.networkFailed ? (
    <div
      className="refresh"
      onClick={props.refresh}
      style={{
        width: "100%",
        height: "40px",
        textAlign: "center",
        background: "rgba(255,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          height: "100%",
          padding: "10px 5px",
        }}
      >
        Connection failed. Click to retry
      </div>
      <RefreshIcon style={{ verticalAlign: "middle" }} />
    </div>
  ) : (
    <Fragment>
      {props.activeTab.name === USERS_TAB && (
        <Fragment>
          <IconButton
            style={{
              ...tabStyle(),
              zIndex: "3",
              opacity: "100%",
              color: isSearchVisible
                ? defaultTheme.palette.primary.main
                : "white",
            }}
            onClick={() => {
              setIsSearchVisible(true);
              setIsSearchFocused(true);
            }}
          >
            <SearchIcon />
          </IconButton>
          <Dialog
            open={isSearchVisible}
            classes={{
              root: props.classes.dialogRoot,
              container: props.classes.dialogContainer,
              paper: props.classes.dialogPaper,
            }}
            BackdropProps={{
              classes: {
                root: props.classes.backdropRoot,
              },
            }}
          >
            <InputBase
              placeholder="Search users..."
              autoFocus
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={props.searchVal}
              onChange={(e) => props.setSearchVal(e.target.value.toLowerCase())}
              classes={{
                root: isSearchFocused
                  ? props.classes.focusedInputRoot
                  : props.classes.inputRoot,
                input: props.classes.inputInput,
              }}
              style={{
                width: "calc(100% - 85px)",
                opacity: isSearchVisible ? "100%" : "0",
                transitionProperty: "opacity",
                transitionDuration: "0.5s",
              }}
            />
            <IconButton
              style={{
                position: "fixed",
                right: "5px",
                height: "20px",
                color: "white",
                opacity: isSearchVisible ? "100%" : "0",
                transitionProperty: "opacity",
                transitionDuration: "0.5s",
              }}
              onClick={() => {
                props.setSearchVal("");
                setIsSearchVisible(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Dialog>
        </Fragment>
      )}
      {props.isLoggedIn && props.activeTab.name !== WELCOME_TAB ? (
        <div
          style={{ width: "100%", height: "40px", position: "fixed", top: "0" }}
        >
          <Tabs
            value={props.highlightedTab ? props.activeTab.name : false}
            indicatorColor="primary"
            textColor="primary"
            onChange={onChangeTab}
            style={{ float: "right", minHeight: "40px" }}
            classes={{
              indicator: isSearchVisible
                ? props.classes.transparent
                : props.classes.opaque,
            }}
          >
            <Tab
              icon={<AddBoxOutlinedIcon />}
              value={CREATE_RECIPE}
              style={tabStyle(CREATE_RECIPE)}
            />
            <Tab
              icon={<MenuBookSharpIcon />}
              value={RECIPE_TAB}
              style={tabStyle(RECIPE_TAB)}
            />
            <Tab
              icon={<PeopleAltIcon />}
              value={USERS_TAB}
              style={tabStyle(USERS_TAB)}
            />
            <Tab
              icon={<AccountCircleIcon />}
              value={PROFILE_TAB}
              style={tabStyle(PROFILE_TAB)}
            />
            <Tab
              icon={<ExitToAppIcon />}
              value={SIGN_OUT}
              style={tabStyle(SIGN_OUT)}
            />
          </Tabs>
        </div>
      ) : (
        <IconButton
          style={{ ...tabStyle(WELCOME_TAB), float: "right" }}
          onClick={() => props.setActiveTab(WELCOME_TAB)}
        >
          <HomeIcon />
        </IconButton>
      )}
      <PromptModal
        modalType="action"
        actionText="Sign Out"
        isVisible={isSignOutModalVisible}
        closeModal={() => setIsSignOutModalVisible(false)}
        onConfirm={() => {
          setIsSignOutModalVisible(false);
          props.signOut();
        }}
        message={"Are you sure you want to sign out?"}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTab: state.activeTab,
    highlightedTab:
      state.activeTab.name === USERS_TAB ||
      state.activeTab.name === RECIPE_TAB ||
      state.activeTab.name === WELCOME_TAB ||
      (state.activeTab.name === PROFILE_TAB &&
        !!state.activeUser &&
        state.activeUser.id === state.displayUser.id),
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    networkFailed: state.errorMessages.networkFailed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearErrorMessages: () => dispatch({ type: CLEAR_ERROR_MESSAGES }),
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
        newTab: { name: WELCOME_TAB },
      });
      dispatch({ type: SIGN_OUT });
      dispatch({ type: SHOW_SNACKBAR, message: "You're signed out" });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NavigationMenu));
