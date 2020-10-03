import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './popups/Spinner';
import NavigationMenu from './menus/NavigationMenu';
import SignInTab from './tabs/SignInTab';
import SignUpTab from './tabs/SignUpTab';
import WelcomeTab from './tabs/WelcomeTab';
import AboutTab from './tabs/AboutTab';
import RecipeTab from './tabs/RecipeTab';
import SearchTab from './tabs/SearchTab';
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
  SEARCH_TAB,
  SIGN_UP_TAB,
  RECIPE_TAB,
  SIGN_IN_TAB,
  WELCOME_TAB,
  ABOUT_TAB,
  PROFILE_TAB
} from '../variables/Constants';
import { defaultTheme } from '../styles';

class App extends React.Component {
  state = {
    showScrollButton: false
  }
  componentDidMount() {
    document.getElementById('root').scrollTo(0, 0);
    const id = isMobile ? 'root' : 'container';
    document.getElementById(id).addEventListener('scroll', this.handleScroll);
    this.props.initHydration();
  }
  handleScroll = () => {
    const id = isMobile ? 'root' : 'container';
    const isScrollButtonVisible = !!document.getElementById(id).scrollTop;
    if (isScrollButtonVisible !== this.state.showScrollButton) {
      this.setState({ showScrollButton: isScrollButtonVisible });
    }
  }
  render() {
    const activeTab = this.props.activeTab.name;
    const mobileStyle = {
      padding: this.props.isLoggedIn
        ? '50px 0 10px'
        : activeTab === SEARCH_TAB || activeTab === RECIPE_TAB || activeTab === PROFILE_TAB
          ? '0 0 10px 0'
          : activeTab === ABOUT_TAB ? '20px 0 5px 0' : '50px 0 10px',
      overflowY: this.props.isDetailVisible ? 'hidden' : 'auto'
    };
    const desktopStyle = {
      position: 'relative',
      top: this.props.isLoggedIn
        ? '50px'
        : this.props.activeTab.name === SEARCH_TAB
        || this.props.activeTab.name === RECIPE_TAB
        || this.props.activeTab.name === PROFILE_TAB
          ? '0'
          : '50px',
      height: this.props.isLoggedIn && this.props.activeTab.name === RECIPE_TAB
        ? 'calc(100vh - 110px)'
        : '100vh',
      overflowY: this.props.isDetailVisible ? 'hidden' : 'auto'
    };
    return (
      <ThemeProvider theme={
        createMuiTheme(defaultTheme)
      }>
        <NavigationMenu/>
        <SuccessSnackbar/>
        <Spinner isVisible={this.props.isSpinnerVisible}/>
        {this.state.showScrollButton && this.props.activeTab.name !== SEARCH_TAB &&
          <ScrollButton isLoggedIn={this.props.isLoggedIn}/>
        }
        {this.props.recipeCreateMode &&
          <RecipeDetailEdit
            id={""}
            name={""}
            image={""}
            ingredients={[]}
            directions={[]}
          />
        }
        <Container
          id="container"
          component="main"
          maxWidth={isMobile ? "xs" : false}
          style={isMobile ? mobileStyle : desktopStyle}
        >
          <CssBaseline />
          {this.props.activeTab.name === SEARCH_TAB && <SearchTab/>}
          {this.props.activeTab.name === PROFILE_TAB && <ProfileTab/>}
          {this.props.activeTab.name === WELCOME_TAB && <WelcomeTab/>}
          {this.props.activeTab.name === ABOUT_TAB &&
            <AboutTab visitSignup={() => this.props.setActiveTab(SIGN_UP_TAB)}/>}
          {this.props.activeTab.name === SIGN_UP_TAB && <SignUpTab/>}
          {this.props.activeTab.name === RECIPE_TAB && <RecipeTab/>}
          {this.props.activeTab.name === SIGN_IN_TAB && <SignInTab/>}
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
    isDetailVisible: !!state.detailRecipe.id,
    recipeCreateMode: state.detailRecipe.createMode,
    usersFetched: state.usersFetched,
    isHydrated: state.isHydrated,
    users: state.users,
    displayUser: state.displayUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    initHydration: () => dispatch({ type: INIT_HYDRATION }),
    setActiveTab: name => dispatch({
      type: SET_ACTIVE_TAB, 
      currentTab: null,
      newTab: { name }
    }),
    completeHydration: () => dispatch({ type: COMPLETE_HYDRATION })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);