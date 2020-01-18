import React from 'react';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import BottomBar from './BottomBar';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';

const App = props => {
  return (
    <ThemeProvider theme={
      createMuiTheme({
        palette: {
          type: 'dark'
        },
      })
    }>
      {props.isSpinnerVisible && <Spinner />}
      <TabPanel />
      <Container
        component="main"
        maxWidth="xs"
        style={{padding:"10px 0"}}
      >
        <CssBaseline />
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