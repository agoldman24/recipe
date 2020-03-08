import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { SET_PROFILE_IMAGE } from '../actions';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { defaultTheme } from '../variables/Constants';
import "../index.css";

const errorStyle = {
  textAlign:'center',
  color:'#ff2200',
  paddingTop:'50px'
};

const gradientTextStyle = {
  background: defaultTheme.palette.primary.mainGradient,
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent'
}

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

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.props.setProfileImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  render() {
    const {
      displayUser: {
        username, firstName, lastName, profileImage,
        friendIds, createdRecipeIds, savedRecipeIds
      }
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
              style={{...textStyle, fontFamily:'Raleway'}}
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
                      {firstName.charAt(0) + lastName.charAt(0)}
                    </Grid>
                    <Grid item style={{lineHeight:'0.5', paddingBottom:'10px'}}>
                    <label className="fileContainer">
                      Upload photo
                      <input type="file" onChange={this.onImageChange}/>
                    </label>
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
    networkFailed: state.errorMessages.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setProfileImage: image => {
      dispatch({ type: SET_PROFILE_IMAGE, image });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);