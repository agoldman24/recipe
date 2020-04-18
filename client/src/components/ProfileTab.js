import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CheckIcon from '@material-ui/icons/Check';
import RecipeList from './RecipeList';
import UsersTable from './UsersTable';
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
  gradientTextStyle2
} from '../variables/Constants';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import FileBase from 'react-file-base64';
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

const imageStyle = {
  width: '120px',
  height: '120px',
  marginRight: '20px',
  fontSize: '30px',
  border: '2px solid black'
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

const photoButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  top: '-50px',
  left: '80px'
};

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

class ProfileTab extends React.Component {

  onImageChange = files => {
    const data = files.base64.toString();
    this.props.updateProfileImage(this.props.activeUser.id, data);
  }

  render() {
    const {
      displayUser: {
        id, username, firstName, lastName, followerIds,
        followingIds, createdRecipeIds, savedRecipeIds
      },
      displayUserDetail,
      activeUser,
      networkFailed,
      updateFollowingIds
    } = this.props;
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
            {!!this.props.tabHistory.length &&
              <Fab
                style={backButtonStyle}
                onClick={() => {
                  const tabHistory = this.props.tabHistory;
                  const { displayUserId } = tabHistory[tabHistory.length - 1];
                  if (!!displayUserId) {
                    this.props.setDisplayUser(this.props.users[displayUserId]);
                  }
                  this.props.setActiveTab(tabHistory[tabHistory.length - 1]);
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
              <div>
                {!!displayUserDetail && !!displayUserDetail.profileImage
                ? <div style={{height:'120px'}}>
                    <Avatar
                      alt="Profile"
                      src={displayUserDetail.profileImage}
                      style={imageStyle}
                    />
                    {!!activeUser && activeUser.id === id &&
                      <Fab style={photoButtonStyle} className="fileContainer">
                        <AddAPhotoIcon style={iconStyle}/>
                        <FileBase type="file" onDone={this.onImageChange}/>
                      </Fab>
                    }
                  </div>
                : <Avatar alt="Profile" style={imageStyle}>
                    <Grid container direction="column" style={{textAlign:'center'}}>
                      <Grid item>
                        {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
                      </Grid>
                      <Grid item style={{lineHeight:'0.5', paddingBottom:'10px'}}>
                      {!!activeUser && activeUser.id === id &&
                        <label className="fileContainer">
                          Upload photo
                          <FileBase type="file" onDone={this.onImageChange}/>
                        </label>
                      }
                      </Grid>
                    </Grid>
                  </Avatar>
                }
              </div>
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
                ? <Button style={buttonStyle}>Edit Profile</Button>
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
                  this.props.setActiveDetail(FOLLOWERS);
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
                  this.props.setActiveDetail(FOLLOWING);
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
                  this.props.setActiveDetail(CREATED_RECIPES);
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
                  this.props.setActiveDetail(SAVED_RECIPES);
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
        </div>
      }
      </div>
    );
  }
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