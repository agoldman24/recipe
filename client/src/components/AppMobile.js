import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import NavigationMenu from './NavigationMenu';
import SignIn from './SignIn';
import SignUp from './SignUp';
import WelcomeTab from './WelcomeTab';
import AboutTab from './AboutTab';
import RecipeTab from './RecipeTab';
import SearchTab from './SearchTab';
import ProfileTab from './ProfileTab';
import SuccessSnackbar from './SuccessSnackbar';
import {
  SEARCH_TAB,
  SIGN_UP_TAB,
  RECIPE_TAB,
  SIGN_IN_TAB,
  WELCOME_TAB,
  ABOUT_TAB,
  PROFILE_TAB,
  defaultTheme
} from '../variables/Constants';

const AppMobile = props => {
  return (
    <ThemeProvider theme={
      createMuiTheme(defaultTheme)
    }>
      <NavigationMenu/>
      <SuccessSnackbar/>
      {props.isSpinnerVisible && <Spinner/>}
      {props.activeTab === PROFILE_TAB && <ProfileTab/>}
      {props.activeTab === SEARCH_TAB && <SearchTab/>}
      <Container
        component="main"
        maxWidth="xs"
        style={{
          padding: '50px 0 10px',
          overflowY: props.isDetailVisible ? 'hidden' : 'auto'
        }}
      >
        <CssBaseline />
        {props.activeTab === WELCOME_TAB && <WelcomeTab/>}
        {props.activeTab === ABOUT_TAB && <AboutTab/>}
        {props.activeTab === SIGN_UP_TAB && <SignUp/>}
        {props.activeTab === RECIPE_TAB && <RecipeTab/>}
        {props.activeTab === SIGN_IN_TAB && <SignIn/>}
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    isSpinnerVisible: state.isSpinnerVisible,
    isDetailVisible: state.isDetailVisible
  };
}

const mapDispatchToProps = dispatch => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppMobile);