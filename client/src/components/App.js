import React from 'react';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import SignIn from './SignIn';
import SignUp from './SignUp';
import RecipeTab from './RecipeTab';

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
        {props.activeTab === "SignIn" && <SignIn />}
        {props.activeTab === "Recipes" && <RecipeTab />}
        {props.activeTab == "SignUp" && <SignUp />}
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
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