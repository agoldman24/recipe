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

const ProfileTab = props => {
  return (
    <div>
    {props.networkFailed
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
      </Grid>
    }
    </div>
  );
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