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
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
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
    fontSize: "12px",
    fontFamily: "Signika",
    fontWeight: "bold",
    borderRadius: "50px",
    marginRight: "5px",
    color: "black",
    background: defaultTheme.palette.primary.main,
  },
});

const NavigationBar = (props) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsSearchVisible(false);
    setIsSearchFocused(false);
  }, [props.recipeCategory]);

  useEffect(() => {
    if (isSearchVisible) {
      document.getElementById("searchInput").focus();
    } else {
      setTimeout(() => props.setKeyword(""), 500);
    }
  }, [isSearchVisible]);

  return props.networkFailed ? (
    <div
      className="refresh"
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
        <Grid container direction="row" style={{ width: "fit-content" }}>
          <Grid item>
            <IconButton
              style={{
                borderRadius: "0",
                width: "fit-content",
                background: isMenuOpen ? "#190023" : "none",
                transitionProperty: "background",
                transitionDuration: "0.5s",
              }}
              onClick={() => setTimeout(() => setIsMenuOpen(!isMenuOpen), 1)}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuRoundedIcon />}
            </IconButton>
          </Grid>
          <Grid
            item
            style={{
              padding: "3px 6px",
              opacity: isSearchVisible ? "0" : "1",
              transitionProperty: "opacity",
              transitionDuration: "0.5s",
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
        </Grid>
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
              width: "calc(100% - 50px)",
              height: "45px",
            }}
          >
            <Grid item style={{ margin: "auto 0 auto auto" }}>
              <InputBase
                id="searchInput"
                placeholder={
                  props.activeTab.name === USERS_TAB
                    ? "Search users..."
                    : "Search recipes..."
                }
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={props.keyword}
                onChange={(e) => {
                  props.setKeyword(e.target.value.toLowerCase());
                }}
                classes={{
                  root: !isSearchVisible
                    ? props.classes.hiddenInputRoot
                    : isSearchFocused
                    ? props.classes.focusedInputRoot
                    : props.classes.inputRoot,
                  input: props.classes.inputInput,
                }}
              />
            </Grid>
            {(props.activeTab.name === USERS_TAB ||
              (props.activeTab.name === RECIPE_TAB &&
                props.recipeCategory === "All")) && (
              <Grid item>
                <IconButton
                  style={{ width: "fit-content" }}
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    setIsSearchFocused(!isSearchFocused);
                  }}
                >
                  {isSearchVisible ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              </Grid>
            )}
            <Grid item style={{ margin: "auto 0" }}>
              {props.isLoggedIn ? (
                <IconButton
                  style={{ width: "fit-content" }}
                  onClick={() =>
                    props.setActiveTab(PROFILE_TAB, props.activeUser)
                  }
                >
                  <AccountCircleIcon />
                </IconButton>
              ) : (
                !props.isSpinnerVisible && (
                  <Button
                    className={props.classes.button}
                    onClick={() => {
                      props.setActiveTab(
                        props.activeTab.name === SIGN_IN_TAB
                          ? SIGN_UP_TAB
                          : SIGN_IN_TAB
                      );
                    }}
                  >
                    {props.activeTab.name === SIGN_IN_TAB
                      ? "Sign Up"
                      : "Sign In"}
                  </Button>
                )
              )}
            </Grid>
          </Grid>
        </Dialog>
        {props.isFetchingRecipes && <LinearProgress />}
      </Dialog>
      <ListMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    activeTab: state.activeTab,
    recipeCategory: state.recipeCategory,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NavigationBar));
