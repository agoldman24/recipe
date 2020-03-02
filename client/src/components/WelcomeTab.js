import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { SET_ACTIVE_TAB } from '../actions';
import { SIGN_IN_TAB, SIGN_UP_TAB, SEARCH_TAB, defaultTheme }
from '../variables/Constants';

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

const buttonStyle = {
  marginTop: '10px',
  width: '350px',
  fontSize: '20px',
  fontWeight: 'bold',
  borderWidth: '3px',
  borderStyle: 'solid',
  fontFamily: 'Raleway'
}

const WelcomeTab = props => {
  return (
    <div>
    {props.networkFailed
    ? <div style={errorStyle}>Network error</div>
    : <Grid
        container
        direction="column"
        style={{alignItems:'center', zIndex:'2'}}
      >
        <Grid item style={{marginBottom:'20px'}}>
          <Typography
            variant="h1"
            style={{
              float:'left',
              fontWeight:'bold',
              fontFamily:'Shadows Into Light',
              ...gradientTextStyle
            }}
          >
            Recipe
          </Typography>
          <Typography
            variant="h1"
            style={{
              float:'left', fontFamily:'Glegoo'
            }}
          >
            Book
          </Typography>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            variant="outlined"
            style={{
              ...buttonStyle,
              borderColor: 'yellow',
              color: 'yellow'
            }}
            onClick={() => props.setActiveTab(SIGN_IN_TAB)}
          >
            Sign In
          </Button>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            variant="outlined"
            style={{
              ...buttonStyle,
              borderColor: '#ffa200',
              color: '#ffa200'
            }}
            onClick={() => props.setActiveTab(SIGN_UP_TAB)}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            variant="outlined"
            style={{
              ...buttonStyle,
              borderColor: '#ff441f',
              color: '#ff441f'
            }}
            onClick={() => props.setActiveTab(SEARCH_TAB)}
          >
            Search Users
          </Button>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            variant="outlined"
            style={{
              ...buttonStyle,
              borderColor: '#ff2e70',
              color: '#ff2e70'
            }}
          >
            View Samples
          </Button>
        </Grid>
      </Grid>
    }
    </div>
  );
}

const mapStateToProps = state => {
  return {};
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomeTab);