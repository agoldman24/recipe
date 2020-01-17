import React from 'react';
import { connect } from 'react-redux';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';

const App = props => {
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
        style={{padding:"10px 0"}}
      >
        <CssBaseline />
        <TopBar />
        {props.isSpinnerVisible && <Spinner />}
        <Grid
          container
          direction="row"
          justify="center"
        >
          <Grid item>
            <RecipeCard/>
          </Grid>
        </Grid>
        <BottomBar />
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    isSpinnerVisible: state.isSpinnerVisible
  };
}

const mapDispatchToProps = dispatch => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);