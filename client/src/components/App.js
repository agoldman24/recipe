import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import HomeIcon from '@material-ui/icons/Home';
import Fab from '@material-ui/core/Fab';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import TabPanel from './TabPanel';
import SignIn from './SignIn';
import SignUp from './SignUp';
import WelcomeTab from './WelcomeTab';
import RecipeTab from './RecipeTab';
import SearchTab from './SearchTab';
import ProfileTab from './ProfileTab';
import SuccessSnackbar from './SuccessSnackbar';
import {
  SIGN_IN_REQUESTED,
  GET_ALL_USERS,
  SET_ACTIVE_TAB,
  SET_DISPLAY_USER,
  HYDRATION_COMPLETE
} from '../actions';
import {
  SEARCH_TAB,
  SIGN_UP_TAB,
  RECIPE_TAB,
  SIGN_IN_TAB,
  WELCOME_TAB,
  PROFILE_TAB,
  defaultTheme
} from '../variables/Constants';

const fabStyle = {
  position: 'fixed',
  right: 5,
  background: 'none',
  boxShadow: 'none',
  color: 'white',
};

class App extends React.Component {
  componentDidMount() {
    document.getElementById('root').scrollTo(0, 0);
    this.props.getAllUsers();
    if (!!localStorage.getItem("activeUserId")) {
      this.props.signIn(localStorage.getItem("activeUserId"));
    }
  }
  componentDidUpdate() {
    if (!this.props.isHydrated && Object.keys(this.props.users).length) {
      if (!!localStorage.getItem("activeTab")) {
        if (localStorage.getItem("activeTab") === PROFILE_TAB) {
          this.props.setDisplayUser(
            this.props.users[localStorage.getItem("displayUserId")]
          );
        }
        this.props.setActiveTab(localStorage.getItem("activeTab"));
      }
      this.props.hydrate();
    }
  }

  render() {
    return (
      <ThemeProvider theme={
        createMuiTheme(defaultTheme)
      }>
        <SuccessSnackbar/>
        {this.props.showHomeButton &&
          <Fab
            style={fabStyle}
            onClick={() => this.props.setActiveTab(WELCOME_TAB)}
          >
            <HomeIcon style={{height:'40', width:'40'}}/>
          </Fab>
        }
        {this.props.isSpinnerVisible && <Spinner />}
        {this.props.isLoggedIn && <TabPanel />}
        {this.props.activeTab === SEARCH_TAB && <SearchTab />}
        {this.props.activeTab === PROFILE_TAB && <ProfileTab />}
        <Container
          component="main"
          maxWidth="xs"
          style={{padding:"50px 0 10px"}}
        >
          <CssBaseline />
          {this.props.activeTab === WELCOME_TAB && <WelcomeTab />}
          {this.props.activeTab === SIGN_UP_TAB && <SignUp />}
          {this.props.activeTab === RECIPE_TAB && <RecipeTab />}
          {this.props.activeTab === SIGN_IN_TAB && <SignIn />}
        </Container>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeTab: state.activeTab,
    activeRecipes: state.activeRecipes,
    isSpinnerVisible: state.isSpinnerVisible,
    isDetailVisible: state.isDetailVisible,
    isHydrated: state.isHydrated,
    users: state.users,
    isLoggedIn: !!state.activeUser,
    showHomeButton: state.activeTab !== WELCOME_TAB && !!state.activeUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    signIn: id => dispatch({ type: SIGN_IN_REQUESTED, id }),
    getAllUsers: () => dispatch({ type: GET_ALL_USERS }),
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab }),
    setDisplayUser: user => dispatch({ type: SET_DISPLAY_USER, user }),
    hydrate: () => dispatch({ type: HYDRATION_COMPLETE })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);