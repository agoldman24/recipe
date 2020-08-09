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
import RecipeTab from './recipes/RecipeTab';
import SearchTab from './tabs/SearchTab';
import ProfileTab from './profile/ProfileTab';
import ScrollButton from './popups/ScrollButton';
import SuccessSnackbar from './popups/SuccessSnackbar';
import {
  SIGN_IN_REQUESTED,
  GET_ALL_USERS,
  SET_ACTIVE_TAB,
  SET_DISPLAY_USER,
  HYDRATION_COMPLETE,
  GET_USER_DETAIL_REQUESTED
} from '../actions';
import {
  SEARCH_TAB,
  SIGN_UP_TAB,
  RECIPE_TAB,
  SIGN_IN_TAB,
  WELCOME_TAB,
  ABOUT_TAB,
  PROFILE_TAB,
  FOLLOWING
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
    this.props.getAllUsers();
    const activeUserId = localStorage.getItem("activeUserId");
    if (!!activeUserId && activeUserId !== "null") {
      this.props.signIn(activeUserId);
    }
  }
  componentDidUpdate() {
    if (this.props.usersFetched && !this.props.isHydrated && Object.keys(this.props.users).length) {
      const activeTabName = localStorage.getItem("activeTab");
      const activeDetail = localStorage.getItem("activeDetail");
      if (!!activeTabName && activeTabName !== "null") {
        if (activeTabName === PROFILE_TAB) {
          this.props.setDisplayUser(
            this.props.users[localStorage.getItem("displayUserId")]
          );
          if (!activeDetail || activeDetail === "null") {
            localStorage.setItem("activeDetail", FOLLOWING);
          }
          this.props.getUserDetail(localStorage.getItem("activeDetail"));
        }
        this.props.setActiveTab(activeTabName);
      } else {
        this.props.setActiveTab(WELCOME_TAB);
      }
      this.props.completeHydrate();
    }
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
          : activeTab === ABOUT_TAB ? '10px 0 0 0' : '50px 0 10px',
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
        ? 'calc(100vh - 130px)'
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
          <ScrollButton
            scrollButtonTop={this.props.isLoggedIn ? '60px' : '10px'}
            zIndex={!this.props.isLoggedIn ? '2' : '3'}
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
    isDetailVisible: state.isDetailVisible,
    usersFetched: state.usersFetched,
    isHydrated: state.isHydrated,
    users: state.users
  };
}

const mapDispatchToProps = dispatch => {
  return {
    signIn: id => dispatch({ type: SIGN_IN_REQUESTED, id }),
    getAllUsers: () => dispatch({ type: GET_ALL_USERS }),
    setActiveTab: name => dispatch({
      type: SET_ACTIVE_TAB, 
      currentTab: null,
      newTab: { name }
    }),
    setDisplayUser: user => dispatch({ type: SET_DISPLAY_USER, user }),
    getUserDetail: activeDetail => dispatch({
      type: GET_USER_DETAIL_REQUESTED, activeDetail
    }),
    completeHydrate: () => dispatch({ type: HYDRATION_COMPLETE })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);