import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import Zoom from '@material-ui/core/Zoom';
import Spinner from './popups/Spinner';
import NavigationMenu from './menus/NavigationMenu';
import SignInTab from './tabs/SignInTab';
import SignUpTab from './tabs/SignUpTab';
import WelcomeTab from './tabs/WelcomeTab';
import AboutTab from './tabs/AboutTab';
import RecipeTab from './tabs/RecipeTab';
import UsersTab from './tabs/UsersTab';
import ProfileTab from './tabs/ProfileTab';
import RecipeDetailEdit from './recipes/RecipeDetailEdit';
import ScrollButton from './popups/ScrollButton';
import SuccessSnackbar from './popups/SuccessSnackbar';
import {
  INIT_HYDRATION,
  COMPLETE_HYDRATION,
  SET_ACTIVE_TAB
} from '../actions';
import {
  USERS_TAB,
  SIGN_UP_TAB,
  RECIPE_TAB,
  SIGN_IN_TAB,
  WELCOME_TAB,
  ABOUT_TAB,
  PROFILE_TAB
} from '../variables/Constants';
import { defaultTheme } from '../styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} mountOnEnter unmountOnExit/>;
});

class App extends React.Component {
  state = {
    showScrollButton: false,
    recipeCreateMode: false,
  }
  componentDidMount() {
    document.getElementById('root').scrollTo(0, 0);
    const id = isMobileOnly ? 'root' : 'container';
    document.getElementById(id).addEventListener('scroll', this.handleScroll);
    this.props.initHydration();
  }
  handleScroll = () => {
    const id = isMobileOnly ? 'root' : 'container';
    const isScrollButtonVisible = !!document.getElementById(id).scrollTop;
    if (isScrollButtonVisible !== this.state.showScrollButton) {
      this.setState({ showScrollButton: isScrollButtonVisible });
    }
  }
  render() {
    const activeTab = this.props.activeTab.name;
    return (
      <ThemeProvider theme={createMuiTheme(defaultTheme)}>
        <SuccessSnackbar/>
        <Spinner isVisible={this.props.isSpinnerVisible}/>
        <ScrollButton isVisible={this.state.showScrollButton} isLoggedIn={this.props.isLoggedIn}/>
        <NavigationMenu toggleCreateMode={() => this.setState({ recipeCreateMode: true })}/>
        <Dialog
          disableBackdropClick
          open={this.state.recipeCreateMode}
          TransitionComponent={Transition}
        >
          <RecipeDetailEdit
            name=""
            image=""
            ingredients={[]}
            directions={[]}
            serves={null}
            isCreateMode={true}
            onClose={() => this.setState({ recipeCreateMode: false })}
          />
        </Dialog>
        <Container
          id="container"
          component="main"
          maxWidth={false}
          style={{
            height: '100vh',
            overflow: 'hidden auto',
            background: 'linear-gradient(45deg, rgb(67 0 128 / 50%), rgb(255 165 0 / 50%)',
            padding: this.props.isLoggedIn	
              ? activeTab === RECIPE_TAB ? '50px 0 80px' : '50px 0 10px'	
              : activeTab === USERS_TAB || activeTab === RECIPE_TAB || activeTab === PROFILE_TAB	
                ? '0 0 10px'
                : activeTab === ABOUT_TAB ? '20px 0 5px' : '50px 0 10px'
          }}
        >
          <CssBaseline />
          {this.props.activeTab.name === SIGN_IN_TAB && <SignInTab/>}
          {this.props.activeTab.name === SIGN_UP_TAB && <SignUpTab/>}
          {this.props.activeTab.name === USERS_TAB && <UsersTab/>}
          {this.props.activeTab.name === PROFILE_TAB && <ProfileTab/>}
          {this.props.activeTab.name === WELCOME_TAB && <WelcomeTab/>}
          {this.props.activeTab.name === ABOUT_TAB &&
            <AboutTab visitSignup={() => this.props.setActiveTab(SIGN_UP_TAB)}/>}
          {this.props.activeTab.name === RECIPE_TAB &&
            <RecipeTab toggleCreateMode={() => this.setState({ recipeCreateMode: true })}/>}
        </Container>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    isLoggedIn: !!state.activeUser,
    isSpinnerVisible: state.isSpinnerVisible,
    recipeCreateMode: state.recipeCreateMode,
    usersFetched: state.usersFetched,
    isHydrated: state.isHydrated,
    users: state.users,
    displayUser: state.displayUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    initHydration: () => dispatch({ type: INIT_HYDRATION }),
    completeHydration: () => dispatch({ type: COMPLETE_HYDRATION }),
    setActiveTab: name => dispatch({
      type: SET_ACTIVE_TAB, 
      currentTab: null,
      newTab: { name }
    })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);