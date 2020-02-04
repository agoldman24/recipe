import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import Fab from '@material-ui/core/Fab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { defaultTheme } from '../variables/Constants';

const BottomBar = props => {
  const fabStyle = {
    position:'fixed',
    bottom:'5vh',
    color:'black',
    zIndex:'999',
    backgroundImage: defaultTheme.palette.primary.mainGradient
  };
  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <Fab
        color="secondary"
        style={{...fabStyle, right:'55%'}}
      >
        <FavoriteIcon />
      </Fab>
      <Fab
        color="secondary"
        style={{...fabStyle, left:'55%'}}
        onClick={props.getRandomRecipe}
      >
        <ShuffleIcon />
      </Fab>
      <div style={{
        position:'fixed',
        width:'100vw',
        height:'100px',
        bottom:'0',
        backgroundImage:'linear-gradient(rgba(0,0,0,0), rgb(20,20,20)',
        boxShadow:'none'
      }}/>
    </ThemeProvider>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomBar);