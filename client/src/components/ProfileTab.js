import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { SET_PROFILE_IMAGE, UPDATE_USER_REQUESTED } from '../actions';
import { PROFILE_IMAGE } from '../variables/Constants';
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
  lineHeight: 1
}

const imageStyle = {
  width: '120px',
  height: '120px',
  marginRight: '20px',
  fontSize: '30px',
  border: '2px solid black'
}

const columnStyle = {
  width: '33.33%',
  textAlign:'center'
}

class ProfileTab extends React.Component {

  onImageChange = (files) => {
    const imageData = files.base64.toString();
    this.props.updateUser(this.props.displayUser.id, imageData);
  }

  render() {
    const {
      displayUser: {
        id, username, firstName, lastName, profileImage,
        friendIds, createdRecipeIds, savedRecipeIds
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
      : <Grid
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
          <Grid item style={{display:'inline-flex'}}>
            <div>
              {!!profileImage
              ? <Avatar alt="Profile" src={profileImage} style={imageStyle}/>
              : <Avatar alt="Profile" style={imageStyle}>
                  <Grid container direction="column" style={{textAlign:'center'}}>
                    <Grid item>
                      {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
                    </Grid>
                    <Grid item style={{lineHeight:'0.5', paddingBottom:'10px'}}>
                    {!!activeUser && activeUser.id === id &&
                      <label className="fileContainer">
                        Upload photo
                        <FileBase
                          type="file"
                          onDone={this.onImageChange}/>
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
          <Grid
            container
            direction="row"
            style={{paddingTop:'20px'}}
          >
            <Grid item style={columnStyle}>
              <Typography style={{...textStyle, fontSize:'40px'}}>
                {friendIds.length}
              </Typography>
              <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                Friends
              </Typography>
            </Grid>
            <Grid item style={columnStyle}>
              <Typography style={{...textStyle, fontSize:'40px'}}>
                {createdRecipeIds.length}
              </Typography>
              <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                Created Recipes
              </Typography>
            </Grid>
            <Grid item style={columnStyle}>
              <Typography style={{...textStyle, fontSize:'40px'}}>
                {savedRecipeIds.length}
              </Typography>
              <Typography style={{...textStyle, fontSize:'16px', fontWeight:'normal'}}>
                Saved Recipes
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    displayUser: state.displayUser,
    activeUser: state.activeUser,
    networkFailed: state.errorMessages.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setProfileImage: image => {
      dispatch({ type: SET_PROFILE_IMAGE, image });
    },
    updateUser: (id, imageData) => {
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: PROFILE_IMAGE,
        id, imageData
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);