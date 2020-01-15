import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import '../index.css';
import Button from '@material-ui/core/Button';
import Spinner from './Spinner';
import AppBar from './AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import SignIn from './SignIn';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const App = () => {

  //render() {
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <AppBar />
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
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
                //onClick={this.props.getRandomRecipe}
              >
                Get New Recipe
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <RecipeCard/>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
      // <Box
      //   style={{
      //     backgroundColor:"#282c34",
      //     paddingBottom:"10vh"
      //   }}
      // >
      //   <AppBar />
      //   <Grid
      //     container
      //     direction="row"
      //     justify="center"
      //     alignItems="center"
      //   >
      //     <Grid item>
      //       <Button
      //         variant="contained"
      //         color="primary"
      //         style={buttonStyle}
      //       >
      //         Add User
      //       </Button>
      //     </Grid>
      //     <Grid item>
      //       <Button
      //         variant="contained"
      //         color="primary"
      //         style={buttonStyle}
      //         onClick={this.props.getRandomRecipe}
      //       >
      //         Get New Recipe
      //       </Button>
      //     </Grid>
      //   </Grid>
      //   <Grid
      //     container
      //     direction="row"
      //     justify="center"
      //     alignItems="center"
      //   >
      //     <Grid item>
      //       <RecipeCard/>
      //     </Grid>
      //   </Grid>
      //   {this.props.isSpinnerVisible ?
      //     <Spinner /> : null
      //   }
      // </Box>
    );
  //}
}

const mapStateToProps = state => {
  return {
    isSpinnerVisible: state.isSpinnerVisible,
    fetchRecipeSuccess: state.fetchRecipeSuccess,
    activeRecipe: state.activeRecipe,
  };
}

// const mapDispatchToProps = dispatch => {
//   return {
//     getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
//   };
// }

export default connect(
  mapStateToProps,
  {}
)(App);
