import React from 'react';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import BottomBar from './BottomBar';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Spinner from './Spinner';
import SignIn from './SignIn';
import SignUp from './SignUp';
import RecipeTab from './RecipeTab';
import SuccessSnackbar from './SuccessSnackbar';
import { FETCH_USER, FETCH_RECIPE_REQUESTED } from '../actions';
import { SIGN_UP_TAB, RECIPE_TAB, SIGN_IN_TAB, defaultTheme }
from '../variables/Constants';

class App extends React.Component {
  componentDidMount() {
    if (!!localStorage.getItem("username")) {
      this.props.fetchUser(
        localStorage.getItem("username"),
        localStorage.getItem("password")
      );
    }
    if (!Object.keys(this.props.activeRecipes).length) {
      this.props.getRandomRecipe();
    }
  }
  render() {
    console.log(this.props.isSnackbarVisible);
    return (
      <ThemeProvider theme={
        createMuiTheme(defaultTheme)
      }>
        {this.props.isSpinnerVisible && <Spinner />}
        <SuccessSnackbar/>
        <TabPanel />
        <BottomBar />
        <Container
          component="main"
          maxWidth="xs"
          style={{padding:"50px 0 10px 0"}}
        >
          <CssBaseline />
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
    isSnackbarVisible: state.isSnackbarVisible
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: (username, password) => dispatch({
      type: FETCH_USER, username, password
    }),
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);