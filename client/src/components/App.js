import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
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
import ScrollButton from './ScrollButton';
import SuccessSnackbar from './SuccessSnackbar';
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
  FOLLOWING,
  defaultTheme
} from '../variables/Constants';

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
    const mobileStyle = {
      padding: '50px 0 10px',
      overflowY: this.props.isDetailVisible ? 'hidden' : 'auto'
    };
    const desktopStyle = {
      position:'relative',
      top:'50px',
      height: this.props.isLoggedIn && this.props.activeTab.name === RECIPE_TAB
        ? 'calc(100vh - 130px)'
        : 'calc(100vh - 50px)',
      overflowY: this.props.isDetailVisible ? 'hidden' : 'auto'
    };
    return (
      <ThemeProvider theme={
        createMuiTheme(defaultTheme)
      }>
        <NavigationMenu/>
        <SuccessSnackbar/>
        {this.state.showScrollButton && <ScrollButton/>}
        {this.props.isSpinnerVisible && <Spinner/>}
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
          {this.props.activeTab.name === ABOUT_TAB && <AboutTab/>}
          {this.props.activeTab.name === SIGN_UP_TAB && <SignUp/>}
          {this.props.activeTab.name === RECIPE_TAB && <RecipeTab/>}
          {this.props.activeTab.name === SIGN_IN_TAB && <SignIn/>}
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