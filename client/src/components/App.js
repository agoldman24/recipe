import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Spinner from "./popups/Spinner";
import NavigationBar from "./menus/NavigationBar";
import SignInTab from "./tabs/SignInTab";
import SignUpTab from "./tabs/SignUpTab";
import AboutTab from "./tabs/AboutTab";
import RecipeTab from "./tabs/RecipeTab";
import UsersTab from "./tabs/UsersTab";
import ProfileTab from "./tabs/ProfileTab";
import RecipeCategories from "./recipes/RecipeCategories";
import RecipeDetailEdit from "./recipes/RecipeDetailEdit";
import SuccessSnackbar from "./popups/SuccessSnackbar";
import { defaultTheme } from "../styles";
import {
  INIT_HYDRATION,
  COMPLETE_HYDRATION,
  SET_ACTIVE_TAB,
  SET_RECIPE_CATEGORY,
  GET_RECIPES_REQUESTED,
} from "../actions";
import {
  USERS_TAB,
  SIGN_UP_TAB,
  RECIPE_TAB,
  SIGN_IN_TAB,
  ABOUT_TAB,
  PROFILE_TAB,
  ALL_RECIPES,
  FRIEND_RECIPES,
  CREATED_RECIPES,
} from "../variables/Constants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit />
  );
});

const styles = () => ({
  root1: {
    marginTop: "45px",
  },
  root2: {
    marginTop: "80px",
  },
  backdropRoot1: {
    top: "45px",
    background: "none",
  },
  backdropRoot2: {
    top: "80px",
    background: "none",
  },
});

class App extends React.Component {
  state = {
    recipeCreateMode: false,
    keyword: "",
  };
  componentDidMount() {
    this.props.initHydration();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.keyword !== prevState.keyword &&
      this.props.activeTab.name === RECIPE_TAB
    ) {
      document.getElementById("container").scrollTo(0, 0);
      this.props.getRecipes(this.props.recipeCategory, this.state.keyword);
    }
  }
  renderActiveTab = () => {
    switch (this.props.activeTab.name) {
      case SIGN_IN_TAB:
        return <SignInTab />;
      case SIGN_UP_TAB:
        return <SignUpTab />;
      case USERS_TAB:
        return <UsersTab keyword={this.state.keyword} />;
      case PROFILE_TAB:
        return <ProfileTab />;
      case ABOUT_TAB:
        return <AboutTab />;
      case RECIPE_TAB:
        return <RecipeTab keyword={this.state.keyword} />;
      default:
        return null;
    }
  };
  render() {
    const activeTab = this.props.activeTab.name;
    const showRecipeCategories =
      this.props.isLoggedIn && activeTab === RECIPE_TAB;
    return (
      <ThemeProvider theme={createMuiTheme(defaultTheme)}>
        <Container component="main" maxWidth={false} style={{ padding: "0" }}>
          <CssBaseline />
          <NavigationBar
            keyword={this.state.keyword}
            setKeyword={(newVal) => this.setState({ keyword: newVal })}
          />
          {showRecipeCategories && (
            <RecipeCategories
              category={this.props.recipeCategory}
              setCategory={this.props.setRecipeCategory}
              toggleCreateMode={() => this.setState({ recipeCreateMode: true })}
            />
          )}
          <Dialog
            open={true}
            classes={{
              root: showRecipeCategories
                ? this.props.classes.root2
                : this.props.classes.root1,
            }}
            BackdropProps={{
              classes: {
                root: showRecipeCategories
                  ? this.props.classes.backdropRoot2
                  : this.props.classes.backdropRoot1,
              },
            }}
          >
            <div
              style={{
                margin: "0",
                left: "0",
                top: showRecipeCategories ? "80px" : "45px",
                height: showRecipeCategories
                  ? "calc(100% - 80px)"
                  : "calc(100% - 45px)",
                width: "100%",
                position: "fixed",
                overflowY: "hidden",
                background: "none",
              }}
            >
              <div id="container" style={{ height: "100%", overflowY: "auto" }}>
                {this.renderActiveTab()}
              </div>
            </div>
          </Dialog>
        </Container>
        <SuccessSnackbar />
        <Spinner isVisible={this.props.isSpinnerVisible} />
        <Dialog
          style={{ zIndex: "1302" }}
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

const mapStateToProps = (state) => {
  return {
    activeTab: state.activeTab,
    isLoggedIn: !!state.activeUser,
    isSpinnerVisible: state.isSpinnerVisible,
    usersFetched: state.usersFetched,
    isHydrated: state.isHydrated,
    users: state.users,
    displayUser: state.displayUser,
    recipeCategory: state.recipeCategory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initHydration: () => dispatch({ type: INIT_HYDRATION }),
    completeHydration: () => dispatch({ type: COMPLETE_HYDRATION }),
    setRecipeCategory: (category) =>
      dispatch({ type: SET_RECIPE_CATEGORY, category }),
    setActiveTab: (name) =>
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name },
      }),
    getRecipes: (category, keyword) =>
      dispatch({
        type: GET_RECIPES_REQUESTED,
        requestType:
          category === "All"
            ? ALL_RECIPES
            : category === "By Friends"
            ? FRIEND_RECIPES
            : CREATED_RECIPES,
        keyword,
        timestamp: Date.now(),
      }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
