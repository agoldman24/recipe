import React from 'react';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import ActionButtons from './ActionButtons';
import BottomBar from './BottomBar';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import SignIn from './SignIn';
import SignUp from './SignUp';
import RecipeTab from './RecipeTab';
import { SIGN_UP_TAB, RECIPE_TAB, SIGN_IN_TAB, defaultTheme } from '../variables/Constants';

const App = props => {
  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      {props.isSpinnerVisible && <Spinner />}
      <TabPanel />
      {props.activeTab === RECIPE_TAB && <ActionButtons />}
      <BottomBar />
      <Container
        component="main"
        maxWidth="xs"
        style={{padding:"60px 0 10px 0"}}
      >
        <CssBaseline />
        {props.activeTab === SIGN_UP_TAB && <SignUp />}
        {props.activeTab === RECIPE_TAB && <RecipeTab />}
        {props.activeTab === SIGN_IN_TAB && <SignIn />}
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