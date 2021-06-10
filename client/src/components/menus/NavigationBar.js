import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import PersonIcon from "@material-ui/icons/Person";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import ListMenu from "./ListMenu";
import { defaultTheme, gradientTextStyle } from "../../styles";
import "../../index.css";
import {
  SET_ACTIVE_TAB,
  CLEAR_ERROR_MESSAGES,
  SET_DISPLAY_USER,
  GET_USER_DETAIL_REQUESTED,
  INIT_HYDRATION,
  SIGN_OUT,
  SHOW_SNACKBAR,
} from "../../actions";
import {
  RECIPE_TAB,
  USERS_TAB,
  PROFILE_TAB,
  SIGN_IN_TAB,
  SIGN_UP_TAB,
} from "../../variables/Constants";

const inputRoot = {
  fontSize: "16px",
  fontFamily: "Signika",
  border: "2px solid white",
  borderRadius: "50px",
  width: "200px",
  opacity: "1",
  transitionProperty: "width, opacity",
  transitionDuration: "0.5s",
};

const styles = () => ({
  inputRoot: inputRoot,
  focusedInputRoot: {
    ...inputRoot,
    border: "2px solid " + defaultTheme.palette.primary.main,
  },
  hiddenInputRoot: {
    ...inputRoot,
    width: "0",
    opacity: "0",
  },
  inputInput: {
    padding: "3px 10px",
  },
  backdropRoot: {
    display: "none",
  },
  paper: {
    margin: "0",
    width: "100%",
    maxWidth: "none",
    borderRadius: "0",
    background: "none",
  },
  button: {
    textTransform: "none",
    fontSize: "16px",
    fontFamily: "Open Sans Condensed",
    fontWeight: "bold",
    height: "45px",
    minWidth: "0",
    padding: "0",
    borderRadius: "50px",
    padding: "0 10px",
    color: defaultTheme.palette.primary.main,
  },
  iconLabel: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Open Sans Condensed",
    fontSize: "14px",
  },
});

const NavigationBar = (props) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!props.isSearchAvailable && !props.keyword.length) {
      setIsSearchVisible(false);
    }
  }, [props.isSearchAvailable, props.keyword]);

  useEffect(() => {
    if (!isSearchVisible) {
      setIsSearchFocused(false);
    }
  }, [isSearchVisible]);

  return props.networkFailed ? (
    <div
      className="clickable"
      onClick={props.refresh}
      style={{
        width: "100%",
        height: "45px",
        textAlign: "center",
        background: "rgba(255,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          height: "100%",
          padding: "14px 5px",
        }}
      >
        Connection failed. Click to retry
      </div>
      <RefreshIcon style={{ verticalAlign: "middle" }} />
    </div>
  ) : (
    <Fragment>
      <Dialog
        open={true}
        style={{ height: "fit-content", zIndex: "1301" }}
        classes={{
          paper: props.classes.paper,
        }}
        BackdropProps={{
          classes: {
            root: props.classes.backdropRoot,
          },
        }}
      >
        <Dialog
          open={true}
          style={{ height: "fit-content", zIndex: "1302" }}
          classes={{
            paper: props.classes.paper,
          }}
          BackdropProps={{
            classes: {
              root: props.classes.backdropRoot,
            },
          }}
        >
          <Grid
            container
            direction="row"
            style={{
              position: "fixed",
              right: "0",
              width: "100%",
              height: "45px",
              borderBottom: "1px solid #ff7200",
            }}
          >
            <Grid item style={{ height: "45px" }}>
              {isMenuOpen ? (
                <CloseIcon
                  className="clickable"
                  style={{ height: "45px", width: "45px", padding: "11px" }}
                />
              ) : (
                <IconButton
                  style={{
                    borderRadius: "0",
                    width: "fit-content",
                  }}
                  onClick={() => setIsMenuOpen(true)}
                >
                  <MenuRoundedIcon />
                </IconButton>
              )}
            </Grid>
            <Grid
              item
              style={{
                padding: "3px 6px",
                position: "fixed",
                left: "45px",
                zIndex: props.isSearchAvailable && isSearchVisible ? "0" : "1",
                opacity: props.isSearchAvailable && isSearchVisible ? "0" : "1",
                transitionProperty: "opacity",
                transitionDuration: "0.5s",
              }}
              className={
                props.isSearchAvailable && isSearchVisible
                  ? "unclickable"
                  : "clickable"
              }
              onClick={() => {
                if (!(props.isSearchAvailable && isSearchVisible)) {
                  props.setActiveTab(RECIPE_TAB);
                }
              }}
            >
              <Typography
                variant="h4"
                style={{
                  float: "left",
                  fontWeight: "bold",
                  fontFamily: "Shadows Into Light",
                  ...gradientTextStyle,
                }}
              >
                Recipe
              </Typography>
              <Typography
                variant="h4"
                style={{ float: "left", fontFamily: "Open Sans Condensed" }}
              >
                Book
              </Typography>
            </Grid>
            <Grid
              item
              style={{
                margin: "auto 0 auto auto",
                opacity: props.isSearchAvailable ? "1" : "0",
              }}
            >
              <InputBase
                id="searchInput"
                placeholder={
                  props.activeTab.name === USERS_TAB
                    ? "Search users..."
                    : "Search recipes..."
                }
                disabled={!props.isSearchAvailable}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={props.keyword}
                onChange={(e) => {
                  props.setKeyword(e.target.value.toLowerCase());
                }}
                classes={{
                  root: !(props.isSearchAvailable && isSearchVisible)
                    ? props.classes.hiddenInputRoot
                    : isSearchFocused
                    ? props.classes.focusedInputRoot
                    : props.classes.inputRoot,
                  input: props.classes.inputInput,
                }}
              />
            </Grid>
            {props.isSearchAvailable && (
              <Grid item>
                <IconButton
                  classes={{ label: props.classes.iconLabel }}
                  style={{
                    width: "fit-content",
                    padding: isSearchVisible ? "12px 10px" : "5px 8px",
                  }}
                  onClick={() => {
                    if (isSearchVisible) {
                      document.getElementById("searchInput").blur();
                      setTimeout(() => props.setKeyword(""), 500);
                      setIsSearchVisible(false);
                    } else {
                      document.getElementById("searchInput").focus();
                      setIsSearchVisible(true);
                      setIsSearchFocused(true);
                    }
                  }}
                >
                  {isSearchVisible ? <CloseIcon /> : <SearchIcon />}
                  {!isSearchVisible && <div>Search</div>}
                </IconButton>
              </Grid>
            )}
            <Grid item>
              {props.isLoggedIn ? (
                props.activeTab.name === PROFILE_TAB ? (
                  <Button
                    className={props.classes.button}
                    onClick={() => {
                      setIsSearchVisible(false);
                      props.setKeyword("");
                      props.signOut();
                    }}
                  >
                    Log Out
                  </Button>
                ) : (
                  <IconButton
                    classes={{ label: props.classes.iconLabel }}
                    style={{ width: "fit-content", padding: "5px 12px" }}
                    onClick={() => {
                      setIsSearchVisible(false);
                      props.setKeyword("");
                      props.setActiveTab(PROFILE_TAB, props.activeUser);
                    }}
                  >
                    <PersonIcon />
                    <div>Profile</div>
                  </IconButton>
                )
              ) : (
                !props.isSpinnerVisible && (
                  <Button
                    className={props.classes.button}
                    onClick={() => {
                      setIsSearchVisible(false);
                      props.setKeyword("");
                      props.setActiveTab(
                        props.activeTab.name === SIGN_IN_TAB
                          ? SIGN_UP_TAB
                          : SIGN_IN_TAB
                      );
                    }}
                  >
                    {props.activeTab.name === SIGN_IN_TAB
                      ? "Sign Up"
                      : "Log In"}
                  </Button>
                )
              )}
            </Grid>
          </Grid>
          {props.isFetchingRecipes && (
            <LinearProgress
              style={{ position: "fixed", top: "45px", width: "100%" }}
            />
          )}
        </Dialog>
      </Dialog>
      <ListMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        setIsSearchVisible={setIsSearchVisible}
        setKeyword={props.setKeyword}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTab: state.activeTab,
    isSearchAvailable:
      state.activeTab.name === USERS_TAB || state.activeTab.name === RECIPE_TAB,
    isFetchingRecipes: state.isFetchingRecipes,
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    isSpinnerVisible: state.isSpinnerVisible,
    networkFailed: state.errorMessages.networkFailed,
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
)(withStyles(styles)(NavigationBar));
