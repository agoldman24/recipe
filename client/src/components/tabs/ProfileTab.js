import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import ProfileAvatar from '../profile/ProfileAvatar';
import ProfileEditor from '../profile/ProfileEditor';
import ProfileDetailsGrid from '../profile/ProfileDetailsGrid';
import {
  UPDATE_USER_REQUESTED,
  GET_USER_DETAIL_REQUESTED,
  SET_ACTIVE_DETAIL,
  SET_ACTIVE_TAB,
  SET_DISPLAY_USER,
  TOGGLE_PROFILE_EDITOR
} from '../../actions';
import {
  FOLLOWERS,
  FOLLOWING_IDS,
  PROFILE_TAB,
  PROFILE,
  POP
} from '../../variables/Constants';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import {
  defaultTheme,
  detailStyle,
  gridStyle,
  errorStyle,
  usernameStyle,
  nameBoxStyle,
  nameStyle,
  buttonStyle,
  backButtonStyle,
  unfollowButtonStyle,
  followingButtonStyle,
  checkIconStyle
} from "../../styles";

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
    background: '#424242'
  },
  title: {
    marginLeft: '-35px',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    fontSize: '20px',
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileTab = props => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
    setTimeout(() => {
      props.toggleProfileEditor(
        props.displayUser.firstName,
        props.displayUser.lastName,
        props.displayUser.username,
        props.displayUserDetail.profileImage
      )
    }, 1);
  };

  const handleClickClose = () => {
    setOpen(!open);
    props.toggleProfileEditor();
  }

  const statesEqual = () => {
    if (!props.profileEditor) {
      return true;
    }
    return props.profileEditor.profileImage === props.displayUserDetail.profileImage
      && props.profileEditor.firstName === props.displayUser.firstName
      && props.profileEditor.lastName === props.displayUser.lastName
      && props.profileEditor.username === props.displayUser.username
  }

  const handleSave = () => {
    handleClickClose();
    if (updateOccurred) {
      const imageData = props.profileEditor.profileImage !== props.displayUserDetail.profileImage
        ? props.profileEditor.profileImage
        : null;
      const firstName = props.profileEditor.firstName !== props.displayUser.firstName
        ? props.profileEditor.firstName
        : null;
      const lastName = props.profileEditor.lastName !== props.displayUser.lastName
        ? props.profileEditor.lastName
        : null;
      const username = props.profileEditor.username !== props.displayUser.username
        ? props.profileEditor.username
        : null;
      if (!!imageData) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', imageData, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
          if (this.status === 200) {
            const reader = new FileReader();
            reader.readAsDataURL(this.response); 
            reader.onloadend = function() {
              props.updateProfile(reader.result, firstName, lastName, username);
            }
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
    activeUser,
    networkFailed,
    updateFollowingIds
  } = props;
  
  const updateOccurred = !statesEqual();

  return (
    <div>
    {networkFailed
    ? <div style={errorStyle}>Network error</div>
    : <div>
        <Grid
          container
          direction="column"
          style={gridStyle}
        >
          {!!props.tabHistory.length &&
            <Fab
              style={{...backButtonStyle, top: !!props.activeUser ? '35px' : '20px'}}
              onClick={() => {
                const tabHistory = props.tabHistory;
                const { displayUserId } = tabHistory[tabHistory.length - 1];
                if (!!displayUserId) {
                  props.setDisplayUser(props.users[displayUserId]);
                }
                props.setActiveTab(tabHistory[tabHistory.length - 1]);
              }}
            >
              <ArrowBackIosIcon/>
            </Fab>
          }
          <Grid item style={{paddingTop: !!props.activeUser ? '0' : '30px'}}>
            <Typography variant="h5" style={usernameStyle}>{username}</Typography>
          </Grid>
          <Grid item style={nameBoxStyle}>
            <ProfileAvatar />
            <Typography style={nameStyle}>{firstName + " " + lastName}</Typography>
          </Grid>
          {!!activeUser
            ? activeUser.id === id
              ? <Button
                  style={buttonStyle}
                  onClick={handleClickOpen}
                >
                  Edit Profile
                </Button>
              : activeUser.followingIds.includes(id)
                ? <div style={{width: isMobileOnly ? '100%' : '50%'}}>
                    <Button
                      onClick={() => updateFollowingIds(activeUser.id, id, false)}
                      style={unfollowButtonStyle}
                    >
                      Unfollow
                    </Button>
                    <Typography style={followingButtonStyle}>
                      Following
                      <CheckIcon style={checkIconStyle}/>
                    </Typography>
                  </div>
                : <Button
                    onClick={() => updateFollowingIds(activeUser.id, id, true)}
                    style={buttonStyle}
                  >
                    Follow
                  </Button>
            : null
          }
        </Grid>
        {!!displayUserDetail &&
          <ProfileDetailsGrid
            displayUser={props.displayUser}
            displayUserDetail={props.displayUserDetail}
            setActiveDetail={props.setActiveDetail}
            activeUser={props.activeUser}
            createdRecipes={props.createdRecipes}
          />
        }
        <Dialog disableBackdropClick open={open} TransitionComponent={Transition}>
          <Card style={detailStyle}>
            <AppBar className={classes.appBar}>
              <Toolbar style={{padding:'0 5px'}}>
                <Button
                  onClick={handleSave}
                  disabled={!updateOccurred}
                >
                  Save
                </Button>
                <Typography className={classes.title}>Edit Profile</Typography>
                <IconButton
                  edge="start"
                  onClick={handleClickClose}
                  aria-label="close"
                  style={{color:'white'}}
                >
                  <CloseIcon/>
                </IconButton>
              </Toolbar>
            </AppBar>
            <Grid
              container
              direction="column"
              style={{
                width: '100%',
                height: '100%',
                background: defaultTheme.palette.background.default
              }}
            >
              <Grid item style={{margin:'50px auto'}}>
                <ProfileAvatar/>
                <ProfileEditor/>
              </Grid>
            </Grid>
          </Card>
        </Dialog>
      </div>
    }
    </div>
  );
}

const mapStateToProps = state => {
  return {
    tabHistory: state.tabHistory,
    users: state.users,
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    createdRecipes: state.createdRecipes,
    activeUser: state.activeUser,
    profileEditor: state.profileEditor,
    networkFailed: state.errorMessages.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateFollowingIds: (id, friendId, keep) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: FOLLOWING_IDS,
        id, friendId, keep
      })
    },
    setActiveDetail: detail => {
      dispatch({ type: SET_ACTIVE_DETAIL, detail })
    },
    setDisplayUser: user => {
      dispatch({ type: SET_DISPLAY_USER, user });
      dispatch({ type: GET_USER_DETAIL_REQUESTED, activeDetail: FOLLOWERS });
    },
    setActiveTab: newTab => {
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: { name: PROFILE_TAB },
        newTab,
        operation: POP
      })
    },
    toggleProfileEditor: (firstName, lastName, username, profileImage) => {
      dispatch({
        type: TOGGLE_PROFILE_EDITOR,
        firstName, lastName, username, profileImage
      });
    },
    updateProfile: (imageData, firstName, lastName, username) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: PROFILE,
        imageData, firstName, lastName, username
      })
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);