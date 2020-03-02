import React from 'react';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import HomeIcon from '@material-ui/icons/Home';
import Fab from '@material-ui/core/Fab';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import SignIn from './SignIn';
import SignUp from './SignUp';
import WelcomeTab from './WelcomeTab';
import RecipeTab from './RecipeTab';
import SearchTab from './SearchTab';
import SuccessSnackbar from './SuccessSnackbar';
import { GET_USER, GET_ALL_USERS, SET_ACTIVE_TAB } from '../actions';
import { SEARCH_TAB, SIGN_UP_TAB, RECIPE_TAB, SIGN_IN_TAB, WELCOME_TAB, defaultTheme }
from '../variables/Constants';

const fabStyle = {
  position: 'fixed',
  background: 'none',
  boxShadow: 'none',
  color: 'white',
};

class App extends React.Component {
  componentDidMount() {
    document.getElementById('root').scrollTo(0, 0);
    if (!!localStorage.getItem("username")) {
      this.props.getUser(
        localStorage.getItem("username"),
        localStorage.getItem("password")
      );
    }
    this.props.getAllUsers();
  }
  render() {
    return (
      <ThemeProvider theme={
        createMuiTheme(defaultTheme)
      }>
        <SuccessSnackbar/>
        {this.props.activeTab === SIGN_UP_TAB
        || this.props.activeTab === SIGN_IN_TAB
        || this.props.activeTab === SEARCH_TAB
        || (this.props.activeTab === RECIPE_TAB && !this.props.isLoggedIn)
        ? <Fab
            style={fabStyle}
            onClick={() => this.props.setActiveTab(WELCOME_TAB)}
          >
            <HomeIcon style={{height:'40', width:'40'}}/>
          </Fab>
        : null}
        {this.props.isSpinnerVisible && <Spinner />}
        {this.props.isLoggedIn && <TabPanel />}
        {this.props.activeTab === SEARCH_TAB && <SearchTab />}
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
    isLoggedIn: state.isLoggedIn
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getUser: (username, password) => dispatch({
      type: GET_USER, username, password
    }),
    getAllUsers: () => dispatch({ type: GET_ALL_USERS }),
    setActiveTab: tab => dispatch({ type: SET_ACTIVE_TAB, tab })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);