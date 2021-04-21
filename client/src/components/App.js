import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
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
import SuccessSnackbar from './popups/SuccessSnackbar';
import { defaultTheme } from '../styles';
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

const styles = () => ({
  root1: {
    marginTop: '40px'
  },
  root2: {
    marginTop: '75px'
  },
  backdropRoot1: {
    top: '40px',
    background: 'none'
  },
  backdropRoot2: {
    top: '75px',
    background: 'none'
  }
});

class App extends React.Component {
  state = {
    recipeCreateMode: false,
    searchVal: ""
  }
  componentDidMount() {
    this.props.initHydration();
  }
  renderActiveTab = () => {
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
    const activeTab = this.props.activeTab.name;
    const showRecipeCategories = this.props.isLoggedIn && activeTab === RECIPE_TAB;
    return (
      <ThemeProvider theme={createMuiTheme(defaultTheme)}>
        <Container component="main" maxWidth={false} style={{padding:'0'}}>
          <CssBaseline/>
          <Grid container direction="column">
            <Grid item style={{width: '100%'}}>
              <Paper elevation={5} style={{
                height: activeTab === USERS_TAB
                  || activeTab === RECIPE_TAB
                  || activeTab === PROFILE_TAB
                    ? '40px' : '100%',
                borderRadius: '0',
                background: 'none'
              }}>
                  <NavigationMenu
                    toggleCreateMode={() => this.setState({ recipeCreateMode: true })}
                    setSearchVal={newVal => this.setState({ searchVal: newVal })}
                    searchVal={this.state.searchVal}
                  />
                  {showRecipeCategories &&
                    <RecipeCategories
                      category={this.props.recipeCategory}
                      setCategory={this.props.setRecipeCategory}
                    />
                  }
              </Paper>
            </Grid>
            <Grid item>
              <Dialog
                open={true}
                classes={{
                  root: showRecipeCategories
                    ? this.props.classes.root2
                    : this.props.classes.root1
                }}
                BackdropProps={{
                  classes: {
                    root: showRecipeCategories
                      ? this.props.classes.backdropRoot2
                      : this.props.classes.backdropRoot1
                  }
                }}
              >
                <div style={{
                  margin: '0',
                  left: '0',
                  top: showRecipeCategories ? '75px' : '40px',
                  height: showRecipeCategories
                    ? 'calc(100% - 75px)'
                    : 'calc(100% - 40px)',
                  width: '100%',
                  position: 'fixed',
                  overflowY: 'hidden',
                  background: 'none'
                }}>
                  <div id="container" style={{height:'100%', overflowY:'auto'}}>
                    {this.renderActiveTab()}
                  </div>
                </div>
              </Dialog>
            </Grid>
          </Grid>
        </Container>
        <SuccessSnackbar/>
        <Spinner isVisible={this.props.isSpinnerVisible}/>
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
)(withStyles(styles)(App));