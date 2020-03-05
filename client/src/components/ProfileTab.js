import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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

class ProfileTab extends React.Component {
  state = { image: null };

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({image: e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  render() {
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
            {!!this.state.image &&
            <img src={this.state.image} id="image" alt="Profile"/>}
          </Grid>
        </Grid>
      }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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