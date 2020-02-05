import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { defaultTheme } from '../variables/Constants';

const ActionButtons = props => {
  const fabStyleTop = {
    position:'fixed',
    top:'10vh',
    color:'black',
    zIndex:'2',
    backgroundImage: defaultTheme.palette.primary.mainGradient
  };
  const fabStyleBottom = {
    position:'fixed',
    bottom:'5vh',
    color:'black',
    zIndex:'2',
    backgroundImage: defaultTheme.palette.primary.mainGradient
  };
  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      {props.isLoggedIn &&
        <Fab style={{...fabStyleTop, right:'10%'}}>
          <CreateIcon />
        </Fab>
      }
      <Fab style={{...fabStyleBottom, right:'55%'}}>
        <FavoriteIcon />
      </Fab>
      <Fab
        style={{...fabStyleBottom, left:'55%'}}
        onClick={props.getRandomRecipe}
      >
        <ShuffleIcon />
      </Fab>
      <div style={{
        position:'fixed',
        width:'100vw',
        height:'100px',
        bottom:'0',
        backgroundImage:'linear-gradient(rgba(0,0,0,0), rgb(20,20,20)'
      }}/>
    </ThemeProvider>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionButtons);