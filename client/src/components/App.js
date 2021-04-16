import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Spinner from './popups/Spinner';
import NavigationMenu from './menus/NavigationMenu';
import SignInTab from './tabs/SignInTab';
import SignUpTab from './tabs/SignUpTab';
import WelcomeTab from './tabs/WelcomeTab';
import AboutTab from './tabs/AboutTab';
import RecipeTab from './tabs/RecipeTab';
import UsersTab from './tabs/UsersTab';
import ProfileTab from './tabs/ProfileTab';
import RecipeCategories from './recipes/RecipeCategories';
import RecipeDetailEdit from './recipes/RecipeDetailEdit';
import ScrollButton from './popups/ScrollButton';
import SuccessSnackbar from './popups/SuccessSnackbar';
import { defaultTheme, errorStyle } from '../styles';
import {
  INIT_HYDRATION,
  COMPLETE_HYDRATION,
  SET_ACTIVE_TAB,
  SET_RECIPE_CATEGORY
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit/>;
});

class App extends React.Component {
  state = {
    showScrollButton: false,
    recipeCreateMode: false,
    searchVal: ""
  }
  componentDidMount() {
    const container = document.getElementById('container');
    container.addEventListener('scroll', this.handleScroll);
    this.props.initHydration();
  }
  handleScroll = () => {
    const container = document.getElementById('container');
    const isScrollButtonVisible = !!container.scrollTop;
    if (isScrollButtonVisible !== this.state.showScrollButton) {
      this.setState({ showScrollButton: isScrollButtonVisible });
    }
  }
  renderActiveTab = () => {
    if (this.props.networkFailed) {
      return <div style={errorStyle}>No internet connection</div>;
    }
    switch (this.props.activeTab.name) {
      case SIGN_IN_TAB:
        return <SignInTab/>;
      case SIGN_UP_TAB:
        return <SignUpTab/>;
      case USERS_TAB:
        return <UsersTab searchVal={this.state.searchVal}/>;
      case PROFILE_TAB:
        return <ProfileTab/>;
      case WELCOME_TAB:
        return <WelcomeTab/>;
      case ABOUT_TAB:
        return <AboutTab/>;
      case RECIPE_TAB:
        return <RecipeTab/>;
      default:
        throw new Error('Unrecognized tab name');
    }
  }
  render() {
    const showRecipeCategories =
      this.props.isLoggedIn && this.props.activeTab.name === RECIPE_TAB;
    return (
      <ThemeProvider theme={createMuiTheme(defaultTheme)}>
        <Container component="main" maxWidth={false} style={{padding:'0'}}>
          <CssBaseline/>
          <Grid container direction="column">
            <Grid item style={{width: '100%'}}>
              <NavigationMenu
                toggleCreateMode={() => this.setState({ recipeCreateMode: true })}
                setSearchVal={newVal => this.setState({ searchVal: newVal })}
              />
              {showRecipeCategories &&
                <RecipeCategories
                  category={this.props.recipeCategory}
                  setCategory={this.props.setRecipeCategory}
                />
              }
            </Grid>
            <Grid item id="container" style={{
              position: 'fixed',
              overflowY: isMobileOnly ? 'scroll' : 'auto',
              top: showRecipeCategories ? '75px' : '40px',
              height: showRecipeCategories ? 'calc(100% - 75px)' : 'calc(100% - 40px)',
              width: '100%',
              borderTop: this.state.showScrollButton
                ? '1px solid black'
                : 'none'
            }}>
              {this.renderActiveTab()}
            </Grid>
          </Grid>
        </Container>
        <SuccessSnackbar/>
        <Spinner isVisible={this.props.isSpinnerVisible}/>
        <ScrollButton
          isVisible={this.state.showScrollButton}
          isLoggedIn={this.props.isLoggedIn}
        />
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
    displayUser: state.displayUser,
    networkFailed: state.errorMessages.networkFailed,
    recipeCategory: state.recipeCategory
  };
}

const mapDispatchToProps = dispatch => {
  return {
    initHydration: () => dispatch({ type: INIT_HYDRATION }),
    completeHydration: () => dispatch({ type: COMPLETE_HYDRATION }),
    setRecipeCategory: category => dispatch({ type: SET_RECIPE_CATEGORY, category }),
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