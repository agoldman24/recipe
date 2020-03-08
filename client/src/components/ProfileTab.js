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

const imageStyle = {
  width: '100px',
  height: '100px',
  marginRight: '20px',
  fontSize: '40px'
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
        username, firstName, lastName, profileImage
      }
    } = this.props;
    return (
      <div style={{width: isMobile ? '100vw' : '30vw', margin:'auto'}}>
      {this.props.networkFailed
      ? <div style={errorStyle}>Network error</div>
      : <Grid
          container
          direction="column"
          style={{
            alignItems:'center',
            //border: '1px solid white'
          }}
        >
          <Grid item>
            <Typography
              variant="h5"
              style={{
                fontWeight:'bold',
                fontFamily:'Raleway'
              }}
            >
              {username}
            </Typography>
          </Grid>
          <Grid item style={{display:'inline-flex'}}>
            <div>
              {!!profileImage
              ? <Avatar alt="Profile" src={profileImage} style={imageStyle}/>
              : <Avatar alt="Profile" style={imageStyle}>
                {firstName.charAt(0) + lastName.charAt(0)}
                </Avatar>
              }
              <label className="fileContainer">
                Upload photo
                <input type="file" onChange={this.onImageChange}/>
              </label>
            </div>
            <Typography
              variant="h4"
              style={{
                fontWeight:'bold',
                fontFamily:'Raleway',
                margin:'20px 0'
              }}
            >
              {firstName + " " + lastName}
            </Typography>
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