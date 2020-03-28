import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CheckIcon from '@material-ui/icons/Check';
import RecipeList from './RecipeList';
import UsersTable from './UsersTable';
import {
  UPDATE_USER_REQUESTED,
  GET_USER_DETAIL_REQUESTED,
  SET_ACTIVE_DETAIL
} from '../actions';
import {
  PROFILE_IMAGE,
  FOLLOWERS,
  FOLLOWING,
  CREATED_RECIPES,
  SAVED_RECIPES,
  FOLLOWING_IDS,
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

const fabStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  top: '-50px',
  left: '80px'
};

const iconStyle = {
  width:'25',
  height:'25'
};

const buttonStyle = {
  border: '1px solid white',
  fontSize: '14px',
  padding: '2px',
  width: isMobile ? '90%' : '50%'
};

class ProfileTab extends React.Component {

  onImageChange = (files) => {
    const imageData = files.base64.toString();
    this.props.updateProfileImage(this.props.activeUser.id, imageData);
  }

  render() {
    const {
      displayUser: {
        id, username, firstName, lastName, profileImage,
        followerIds, followingIds, createdRecipeIds, savedRecipeIds
      },
      activeUser
    } = this.props;
    return (
      <div style={{
        width: isMobile ? '100vw' : '50vw',
        padding: '50px 0 10px',
        margin: 'auto'
      }}>
      {this.props.networkFailed
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
                {!!profileImage
                ? <div style={{height:'120px'}}>
                    <Avatar alt="Profile" src={profileImage} style={imageStyle}/>
                    {!!this.props.activeUser &&
                      this.props.activeUser.id === this.props.displayUser.id &&
                        <Fab style={fabStyle} className="fileContainer">
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
            {!!this.props.activeUser
              ? this.props.activeUser.id === this.props.displayUser.id
                ? <Button style={buttonStyle}>Edit Profile</Button>
                : this.props.activeUser.followingIds.includes(this.props.displayUser.id)
                  ? <div style={{width:'100%'}}>
                      <Button
                        onClick={() => {
                          this.props.updateFollowingIds(
                            this.props.activeUser.id,
                            this.props.displayUser.id,
                            false
                          )
                        }}
                        style={{
                          ...buttonStyle,
                          float:'right',
                          margin: isMobile ? '0 5%' : '0 10%',
                          width: isMobile ? '60%' : '50%'
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
                      onClick={() => {
                        this.props.updateFollowingIds(
                          this.props.activeUser.id,
                          this.props.displayUser.id,
                          true
                        )
                      }}
                      style={buttonStyle}
                    >
                      Follow
                    </Button>
              : null
            }
          </Grid>
          {!!this.props.displayUserDetail &&
          <div>
            <Grid
              container
              direction="row"
              style={{padding:'20px 0'}}
            >
              <Grid item className="clickable" style={columnStyle} onClick={() => {
                  this.props.setActiveDetail(FOLLOWERS);
                }}>
                {this.props.displayUserDetail.activeDetail === FOLLOWERS
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
                {this.props.displayUserDetail.activeDetail === FOLLOWING
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
                {this.props.displayUserDetail.activeDetail === CREATED_RECIPES
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
                {this.props.displayUserDetail.activeDetail === SAVED_RECIPES
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
            {this.props.displayUserDetail.activeDetail === FOLLOWERS &&
              <UsersTable users={Object.values(this.props.displayUserDetail.followers)}/>
            }
            {this.props.displayUserDetail.activeDetail === FOLLOWING &&
              <UsersTable users={Object.values(this.props.displayUserDetail.following)}/>
            }
            {this.props.displayUserDetail.activeDetail === CREATED_RECIPES &&
              <RecipeList recipes={this.props.displayUserDetail.createdRecipes}/>
            }
            {this.props.displayUserDetail.activeDetail === SAVED_RECIPES &&
              <RecipeList recipes={this.props.displayUserDetail.savedRecipes}/>
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
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    activeUser: state.activeUser,
    networkFailed: state.errorMessages.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateProfileImage: (id, imageData) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: PROFILE_IMAGE,
        id, imageData
      });
    },
    updateFollowingIds: (id, friendId, keep) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: FOLLOWING_IDS,
        id, friendId, keep
      })
    },
    getUserDetail: activeDetail => {
      dispatch({ type: GET_USER_DETAIL_REQUESTED, activeDetail })
    },
    setActiveDetail: detail => {
      dispatch({ type: SET_ACTIVE_DETAIL, detail })
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);