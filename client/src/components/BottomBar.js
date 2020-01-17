import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Grid from '@material-ui/core/Grid';

const BottomBar = props => {
  const buttonStyle = {
    margin:"0 5px"
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <div style={{width:"100%", textAlign:"center"}}>
      <AppBar
        position="fixed"
        style={{
          background:"transparent",
          boxShadow:"none",
          top:"auto",
          bottom: 10
        }}>
        <Toolbar >
          <Grid
            container
            direction="row"
            justify="center"
          >
            <Grid item>
              <Fab
                color="primary"
                style={buttonStyle}
              >
                <FavoriteIcon />
              </Fab>
            </Grid>
            <Grid item>
              <Fab
                color="primary"
                style={buttonStyle}
                onClick={props.getRandomRecipe}
              >
                <ShuffleIcon />
              </Fab>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {};
}

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomBar);