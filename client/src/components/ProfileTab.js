import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { defaultTheme } from '../variables/Constants';

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
  width: '200px',
  height: '200px'
}

class ProfileTab extends React.Component {
  state = { image: null };

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }
  }

  render() {
    const {
      displayUser: {
        username, firstName, lastName, profileImage
      }
    } = this.props;
    return (
      <div>
      {this.props.networkFailed
      ? <div style={errorStyle}>Network error</div>
      : <Grid
          container
          direction="column"
          style={{alignItems:'center'}}
        >
          <Grid item style={{marginBottom:'20px'}}>
            <Typography
              variant="h1"
              style={{
                float:'left',
                fontWeight:'bold',
                fontFamily:'Raleway',
                ...gradientTextStyle
              }}
            >
              Profile
            </Typography>
          </Grid>
          <Grid item>
            <input type="file" onChange={this.onImageChange} id="image_input"/>
          </Grid>
          <Grid item>
            {!!profileImage
            ? <Avatar alt="Profile" src={this.state.image} style={imageStyle}/>
            : <Avatar alt="Profile" style={imageStyle}>
              {firstName.charAt(0) + lastName.charAt(0)}
              </Avatar>
            }
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);