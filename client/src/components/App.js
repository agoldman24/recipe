import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import Button from '@material-ui/core/Button';
import AppBar from './AppBar';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const App = props => {
    const buttonStyle = {
      fontSize:"15px",
      padding:"15px 20px",
      margin:"10px 5px"
    };
    return (
      <ThemeProvider theme={React.useMemo(
        () =>
          createMuiTheme({
            palette: {
              type: 'dark'
            },
          })
      )}>
        <Container
          component="main"
          maxWidth="xs"
          style={{paddingBottom:"10vh"}}
        >
          <CssBaseline />
          <AppBar />
          <Grid
            container
            direction="row"
            justify="center"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={buttonStyle}
              >
                Add User
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={buttonStyle}
                onClick={props.getRandomRecipe}
              >
                New Recipe
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
          >
            <Grid item>
              <RecipeCard/>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    );
}

const mapStateToProps = state => {
  return {
    fetchRecipeSuccess: state.fetchRecipeSuccess,
    activeRecipe: state.activeRecipe,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
