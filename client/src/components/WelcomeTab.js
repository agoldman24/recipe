import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { SET_ACTIVE_TAB } from '../actions';
import {
  SIGN_IN_TAB, SIGN_UP_TAB, SEARCH_TAB,
  RECIPE_TAB, ABOUT_TAB, gradientTextStyle
} from '../variables/Constants';

const buttonStyle = {
  marginTop: '10px',
  width: '350px',
  fontSize: '20px',
  fontWeight: 'bold',
  borderWidth: '3px',
  borderStyle: 'solid',
  fontFamily: 'Raleway'
}

const errorStyle = {
  textAlign:'center',
  color:'#ff2200'
};

const WelcomeTab = props => {
  return (
    <Grid
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
            fontFamily:'Shadows Into Light',
            ...gradientTextStyle
          }}
        >
          Recipe
        </Typography>
        <Typography
          variant="h1"
          style={{
            float:'left', fontFamily:'Open Sans Condensed'
          }}
        >
          Book
        </Typography>
      </Grid>
      {!props.isSpinnerVisible &&
      (props.networkFailed
      ? <div style={errorStyle}>Network error</div>
      : <div>
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
                borderColor: '#ffb700',
                color: '#ffb700'
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
                borderColor: '#ff7b00',
                color: '#ff7b00'
              }}
              onClick={() => props.setActiveTab(ABOUT_TAB)}
            >
              About
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
              Users
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
              onClick={() => props.setActiveTab(RECIPE_TAB)}
            >
              Samples
            </Button>
          </Grid>
        </div>
      )}
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    isSpinnerVisible: state.isSpinnerVisible,
    networkFailed: state.errorMessages.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveTab: name => dispatch({
      type: SET_ACTIVE_TAB,
      currentTab: null,
      newTab: { name }
    })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomeTab);