import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CheckIcon from '@material-ui/icons/Check';
import RecipeList from './RecipeList';
import UsersTable from './UsersTable';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import ProfileAvatar from './ProfileAvatar';
import {
  UPDATE_USER_REQUESTED,
  GET_USER_DETAIL_REQUESTED,
  SET_ACTIVE_DETAIL,
  SET_ACTIVE_TAB,
  SET_DISPLAY_USER
} from '../actions';
import {
  PROFILE_IMAGE,
  FOLLOWERS,
  FOLLOWING,
  CREATED_RECIPES,
  SAVED_RECIPES,
  FOLLOWING_IDS,
  PROFILE_TAB,
  POP,
  defaultTheme,
  gradientTextStyle2
} from '../variables/Constants';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import "../index.css";

const errorStyle = {
  textAlign:'center',
  color:'#ff2200',
  paddingTop:'50px'
};

const textStyle = {
  fontWeight:'bold',
  fontFamily:'Signika',
  lineHeight: 1,
}

const columnStyle = {
  width: '25%',
  textAlign: 'center'
}

const unselected = {
  paddingBottom: '10px'
}

const selected = {
  paddingBottom: '10px',
  borderBottom:'2px solid #ffc800'
}

const backButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  position: 'fixed', top: '40px', left: '10px'
};

const iconStyle = {
  width:'25',
  height:'25'
};

const buttonStyle = {
  border: '1px solid white',
  fontSize: '14px',
  padding: '2px',
  width: isMobile ? '90%' : '40%'
};

const tableStyle = {
  width: isMobile ? '100%' : '60%',
  margin: 'auto'
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: '#424242'
  },
  title: {
    marginLeft: theme.spacing(2),
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    displayUser: {
      id, username, firstName, lastName, followerIds,
      followingIds, createdRecipeIds, savedRecipeIds
    },
    displayUserDetail,
    activeUser,
    networkFailed,
    updateFollowingIds
  } = props;
  return (
    <div>
    {networkFailed
    ? <div style={errorStyle}>Network error</div>
    : <div>
        <Grid
          container
          direction="column"
          style={{
            alignItems:'center',
            padding: '0 10px'
          }}
        >
          {!!props.tabHistory.length &&
            <Fab
              style={backButtonStyle}
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
          <Grid item>
            <Typography
              variant="h5"
              style={{...textStyle, fontFamily:'Raleway', padding:'10px 0'}}
            >
              {username}
            </Typography>
          </Grid>
          <Grid item style={{display:'inline-flex', paddingBottom:'20px'}}>
            <ProfileAvatar />
            <Typography
              style={{
                ...textStyle,
                fontSize: '24px',
                margin:'auto'
              }}
            >
              {firstName + " " + lastName}
            </Typography>
          </Grid>
          {!!activeUser
            ? activeUser.id === id
              ? <Button style={buttonStyle} onClick={handleClickOpen}>Edit Profile</Button>
              : activeUser.followingIds.includes(id)
                ? <div style={{width: isMobile ? '100%' : '50%'}}>
                    <Button
                      onClick={() => updateFollowingIds(activeUser.id, id, false)}
                      style={{
                        ...buttonStyle,
                        float:'right',
                        margin: '0 5%',
                        width: '60%'
                      }}
                    >
                      Unfollow
                    </Button>
                    <Typography
                      style={{
                        float:'right', fontSize:'16px', color:'#00d412'
                      }}
                    >
                      Following
                      <CheckIcon
                        style={{
                          ...iconStyle,
                          verticalAlign:'top',
                          marginLeft:'5px',
                          color:'#00d412'
                        }}/>
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
        <div>
          <Grid
            container
            direction="row"
            style={{
              width: isMobile ? '100%' : '50%',
              margin: 'auto',
              paddingTop: '20px'
            }}
          >
            <Grid item className="clickable" style={columnStyle} onClick={() => {
                props.setActiveDetail(FOLLOWERS);
              }}>
              {displayUserDetail.activeDetail === FOLLOWERS
              ? <div style={selected}>
                  <Typography style={{...gradientTextStyle2, ...textStyle, fontSize:'40px'}}>
                    {followerIds.length}
                  </Typography>
                  <Typography style={{ color:'#ffc800', ...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Followers
                  </Typography>
                </div>
              : <div style={unselected}>
                  <Typography style={{...textStyle, fontSize:'40px'}}>
                    {followerIds.length}
                  </Typography>
                  <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Followers
                  </Typography>
                </div>
              }
            </Grid>
            <Grid item className="clickable" style={columnStyle} onClick={() => {
                props.setActiveDetail(FOLLOWING);
              }}>
              {displayUserDetail.activeDetail === FOLLOWING
              ? <div style={selected}>
                  <Typography style={{...gradientTextStyle2, ...textStyle, fontSize:'40px'}}>
                    {followingIds.length}
                  </Typography>
                  <Typography style={{ color:'#ffc800', ...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Following
                  </Typography>
                </div>
              : <div style={unselected}>
                  <Typography style={{...textStyle, fontSize:'40px'}}>
                    {followingIds.length}
                  </Typography>
                  <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Following
                  </Typography>
                </div>
              }
            </Grid>
            <Grid item className="clickable" style={columnStyle} onClick={() => {
                props.setActiveDetail(CREATED_RECIPES);
              }}>
              {displayUserDetail.activeDetail === CREATED_RECIPES
              ? <div style={selected}>
                  <Typography style={{...gradientTextStyle2, ...textStyle, fontSize:'40px'}}>
                    {createdRecipeIds.length}
                  </Typography>
                  <Typography style={{ color:'#ffc800', ...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Created Recipes
                  </Typography>
                </div>
              : <div style={unselected}>
                  <Typography style={{...textStyle, fontSize:'40px'}}>
                    {createdRecipeIds.length}
                  </Typography>
                  <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Created Recipes
                  </Typography>
                </div>
              }
            </Grid>
            <Grid item className="clickable" style={columnStyle} onClick={() => {
                props.setActiveDetail(SAVED_RECIPES);
              }}>
              {displayUserDetail.activeDetail === SAVED_RECIPES
              ? <div style={selected}>
                  <Typography style={{...gradientTextStyle2, ...textStyle, fontSize:'40px'}}>
                    {savedRecipeIds.length}
                  </Typography>
                  <Typography style={{ color:'#ffc800', ...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Saved Recipes
                  </Typography>
                </div>
              : <div style={unselected}>
                  <Typography style={{...textStyle, fontSize:'40px'}}>
                    {savedRecipeIds.length}
                  </Typography>
                  <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                    Saved Recipes
                  </Typography>
                </div>
              }
            </Grid>
          </Grid>
          {displayUserDetail.activeDetail === FOLLOWERS &&
            <div style={tableStyle}>
              <UsersTable users={Object.values(displayUserDetail.followers)}/>
            </div>
          }
          {displayUserDetail.activeDetail === FOLLOWING &&
            <div style={tableStyle}>
              <UsersTable users={Object.values(displayUserDetail.following)}/>
            </div>
          }
          {displayUserDetail.activeDetail === CREATED_RECIPES &&
            <RecipeList recipes={Object.values(displayUserDetail.createdRecipes)}/>
          }
          {displayUserDetail.activeDetail === SAVED_RECIPES &&
            <RecipeList recipes={
              Object.values(displayUserDetail.savedRecipes).sort((r1, r2) => {
                return r2.timestamp - r1.timestamp;
              })
            }/>
          }
        </div>
        }
        <Dialog
          fullScreen open={open} onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Button
                edge="start"
                onClick={handleClose}
                aria-label="close"
                style={{color:'white'}}
              >
                Cancel
              </Button>
              <Typography variant="h6" className={classes.title}>
                Edit Profile
              </Typography>
              <Button style={{color:'white'}} onClick={handleClose}>
                Save
              </Button>
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
            <Grid item style={{margin:'auto'}}>
              <ProfileAvatar/>
            </Grid>
          </Grid>
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
    activeUser: state.activeUser,
    networkFailed: state.errorMessages.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateProfileImage: (id, data) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: PROFILE_IMAGE,
        id, data
      });
    },
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);