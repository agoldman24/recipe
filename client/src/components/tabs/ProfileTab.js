import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import ProfileAvatar from "../profile/ProfileAvatar";
import ProfileEditor from "../profile/ProfileEditor";
import ProfileDetailsGrid from "../profile/ProfileDetailsGrid";
import {
  defaultTheme,
  detailStyle,
  nameStyle,
  roundedButtonStyle,
  backButtonStyle,
} from "../../styles";
import {
  UPDATE_USER_REQUESTED,
  GET_USER_DETAIL_REQUESTED,
  SET_ACTIVE_DETAIL,
  SET_ACTIVE_TAB,
  SET_DISPLAY_USER,
  TOGGLE_PROFILE_EDITOR,
} from "../../actions";
import {
  FOLLOWING_IDS,
  PROFILE_TAB,
  PROFILE,
  POP,
} from "../../variables/Constants";

const useStyles = makeStyles(() => ({
  appBar: {
    position: "relative",
    background: "black",
  },
  title: {
    marginLeft: "-35px",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontFamily: "Raleway",
    fontSize: "20px",
    flex: 1,
  },
  button: {
    color: "#45bbff",
  },
  paper: {
    borderRadius: "4px",
    border: "1px solid white",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileTab = (props) => {
  const classes = useStyles();
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const container = document.getElementById("container");
  const profileDetailsBar = document.getElementById("profileDetailsBar");
  const profileDetailsContent = document.getElementById(
    "profileDetailsContent"
  );
  if (!!profileDetailsBar) {
    container.onscroll = () => {
      if (container.scrollTop > 154) {
        profileDetailsBar.style.position = "fixed";
        profileDetailsBar.style.top = "45px";
        profileDetailsContent.style.paddingTop = "85px";
      } else {
        profileDetailsBar.style.position = "initial";
        profileDetailsBar.style.top = "initial";
        profileDetailsContent.style.paddingTop = "initial";
      }
    };
  }

  const openProfileEditor = () => {
    setIsProfileEditorOpen(true);
    setTimeout(() => {
      props.toggleProfileEditor(
        props.displayUser.firstName,
        props.displayUser.lastName,
        props.displayUser.username,
        props.displayUserDetail.profileImage
      );
    }, 1);
  };

  const closeProfileEditor = () => {
    setIsProfileEditorOpen(false);
    props.toggleProfileEditor();
  };

  const statesEqual = () => {
    if (!props.profileEditor) {
      return true;
    }
    return (
      props.profileEditor.profileImage ===
        props.displayUserDetail.profileImage &&
      props.profileEditor.firstName === props.displayUser.firstName &&
      props.profileEditor.lastName === props.displayUser.lastName &&
      props.profileEditor.username === props.displayUser.username
    );
  };

  const handleSave = () => {
    closeProfileEditor();
    if (updateOccurred) {
      const imageData =
        props.profileEditor.profileImage !==
        props.displayUserDetail.profileImage
          ? props.profileEditor.profileImage
          : null;
      const firstName =
        props.profileEditor.firstName !== props.displayUser.firstName
          ? props.profileEditor.firstName
          : null;
      const lastName =
        props.profileEditor.lastName !== props.displayUser.lastName
          ? props.profileEditor.lastName
          : null;
      const username =
        props.profileEditor.username !== props.displayUser.username
          ? props.profileEditor.username
          : null;
      if (!!imageData) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", imageData, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
          if (this.status === 200) {
            const reader = new FileReader();
            reader.readAsDataURL(this.response);
            reader.onloadend = function () {
              props.updateProfile(reader.result, firstName, lastName, username);
            };
          }
        };
        xhr.send();
      } else {
        props.updateProfile(imageData, firstName, lastName, username);
      }
    }
  };

  const {
    displayUser: { id, username, firstName, lastName },
    displayUserDetail,
    isFetchingUserDetail,
    activeUser,
    updateFollowingIds,
  } = props;

  const updateOccurred = !statesEqual();

  return (
    <Fragment>
      <Fab
        style={{
          ...backButtonStyle,
          top: "40px",
          opacity: !!props.tabHistory.length ? "1" : "0",
        }}
        onClick={() => {
          if (!!props.tabHistory.length) {
            const tabHistory = props.tabHistory;
            const { displayUserId } = tabHistory[tabHistory.length - 1];
            if (!!displayUserId) {
              props.setDisplayUser(props.users[displayUserId]);
            }
            props.setActiveTab(tabHistory[tabHistory.length - 1]);
          }
        }}
      >
        <ArrowBackIosIcon />
      </Fab>
      <Grid container direction="column" style={{ alignItems: "center" }}>
        <Grid
          item
          style={{
            display: "inline-flex",
            width: isMobileOnly ? "100%" : "50%",
            padding: "20px 0 15px",
          }}
        >
          <div style={{ width: "40%" }}>
            <div style={{ float: "right" }}>
              <ProfileAvatar isEditable={false} />
            </div>
          </div>
          <div style={{ width: "60%", position: "relative" }}>
            <Grid
              container
              direction="column"
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                paddingLeft: "15px",
              }}
            >
              <Grid
                item
                style={{
                  fontFamily: "Open Sans Condensed",
                  fontSize: "16px",
                  color: "#a6a6a6",
                }}
              >
                {username}
              </Grid>
              <Grid item style={{ padding: "10px 0" }}>
                <Typography style={nameStyle}>
                  {firstName + " " + lastName}
                </Typography>
              </Grid>
              {!!activeUser && (
                <Grid item style={{ paddingTop: "5px" }}>
                  {activeUser.id === id ? (
                    <Button
                      style={{
                        ...roundedButtonStyle,
                        width: "150px",
                      }}
                      onClick={openProfileEditor}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      endIcon={
                        props.isUpdatingFollowers ||
                        !activeUser.followingIds.includes(id) ? null : (
                          <ExpandMoreIcon />
                        )
                      }
                      onClick={(e) => {
                        if (!activeUser.followingIds.includes(id)) {
                          updateFollowingIds(activeUser.id, id, true);
                        } else {
                          setAnchorEl(e.currentTarget);
                        }
                      }}
                      style={{ ...roundedButtonStyle, width: "150px" }}
                    >
                      {props.isUpdatingFollowers ? (
                        <CircularProgress
                          size={20}
                          style={{ color: "white", margin: "2px" }}
                        />
                      ) : activeUser.followingIds.includes(id) ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </Button>
                  )}
                </Grid>
              )}
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{ paper: classes.paper }}
      >
        <Button
          style={{ fontSize: "14px", background: "black", padding: "2px 20px" }}
          onClick={() => {
            setAnchorEl(null);
            updateFollowingIds(activeUser.id, id, false);
          }}
        >
          Unfollow
        </Button>
      </Popover>
      {isFetchingUserDetail && (
        <div style={{ width: "100%", textAlign: "center", padding: "20px" }}>
          <CircularProgress size={30} style={{ color: "white" }} />
        </div>
      )}
      {!!displayUserDetail && (
        <ProfileDetailsGrid
          displayUser={props.displayUser}
          displayUserDetail={props.displayUserDetail}
          setActiveDetail={props.setActiveDetail}
          activeUser={props.activeUser}
          createdRecipes={props.createdRecipes}
        />
      )}
      <Dialog
        disableBackdropClick
        open={isProfileEditorOpen}
        TransitionComponent={Transition}
        style={{ zIndex: "1302" }}
      >
        <Card style={detailStyle}>
          <AppBar className={classes.appBar}>
            <Toolbar style={{ minHeight: "0", padding: "5px 0" }}>
              <Button
                onClick={handleSave}
                disabled={!updateOccurred}
                className={classes.button}
              >
                Save
              </Button>
              <Typography className={classes.title}>Edit Profile</Typography>
              <IconButton
                edge="start"
                onClick={closeProfileEditor}
                style={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid
            container
            direction="column"
            style={{
              width: "100%",
              height: "100%",
              background: defaultTheme.palette.background.default,
            }}
          >
            <Grid item style={{ margin: "30px auto" }}>
              <ProfileAvatar isEditable={true} />
              <ProfileEditor closeProfileEditor={closeProfileEditor} />
            </Grid>
          </Grid>
        </Card>
      </Dialog>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    tabHistory: state.tabHistory,
    users: state.users,
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    createdRecipes: state.createdRecipes,
    activeUser: state.activeUser,
    profileEditor: state.profileEditor,
    isUpdatingFollowers: state.isUpdatingFollowers,
    isFetchingUserDetail: state.isFetchingUserDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFollowingIds: (id, friendId, keep) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: FOLLOWING_IDS,
        id,
        friendId,
        keep,
      });
    },
    setActiveDetail: (detail) => {
      dispatch({ type: SET_ACTIVE_DETAIL, detail });
    },
    setDisplayUser: (user) => {
      dispatch({ type: SET_DISPLAY_USER, user });
      dispatch({ type: GET_USER_DETAIL_REQUESTED });
    },
    setActiveTab: (newTab) => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: { name: PROFILE_TAB },
        newTab,
        operation: POP,
      });
    },
    toggleProfileEditor: (firstName, lastName, username, profileImage) => {
      dispatch({
        type: TOGGLE_PROFILE_EDITOR,
        firstName,
        lastName,
        username,
        profileImage,
      });
    },
    updateProfile: (imageData, firstName, lastName, username) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: PROFILE,
        imageData,
        firstName,
        lastName,
        username,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTab);
