import React from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeCategories from '../recipes/RecipeCategories';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { SET_RECIPE_CATEGORY, GET_RECIPES_REQUESTED } from '../../actions';
import { ALL_RECIPES, FRIEND_RECIPES, CREATED_RECIPES } from '../../variables/Constants';
import { errorStyle } from '../../styles';

class RecipeTab extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchRecipes();
  }
  componentDidUpdate(prevProps) {
    if ((this.props.refreshNeeded && !prevProps.refreshNeeded)
      || (this.props.category !== prevProps.category && !Object.keys(this.props.recipes).length)
    ) {
      const id = isMobileOnly ? 'root' : 'container';
      document.getElementById(id).scrollTo(0, 0);
      this.fetchRecipes();
    }
  }
  fetchRecipes = () => {
    // if (!Object.keys(this.props.recipes).length) {
      this.props.getRecipes(
        this.props.requestType,
        this.props.users,
        this.props.activeUser,
        this.props.friendRecipes,
        this.props.createdRecipes
      );
    // }
  }
  render() {
    return (
      <div>
        {this.props.networkFailed
        ? <div style={errorStyle}>Network error</div>
        : <div>
            <RecipeList recipes={Object.values(this.props.recipes)
              .sort((r1, r2) => r2.timestamp - r1.timestamp)}
            />
              {this.props.isLoggedIn &&
                <RecipeCategories
                  category={this.props.category}
                  setCategory={this.props.setCategory}
                  toggleCreateMode={this.props.toggleCreateMode}
                />
              }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    networkFailed: state.errorMessages.networkFailed,
    category: state.recipeCategory,
    friendRecipes: state.friendRecipes,
    createdRecipes: state.createdRecipes,
    recipes: state.recipeCategory === "All"
      ? state.allRecipes
      : state.recipeCategory === "By Friends"
        ? state.friendRecipes
        : state.createdRecipes,
    requestType: state.recipeCategory === "All"
      ? ALL_RECIPES
      : state.recipeCategory === "By Friends"
        ? FRIEND_RECIPES
        : CREATED_RECIPES,
    refreshNeeded: state.refreshNeeded,
    users: state.users,
    activeUser: state.activeUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setCategory: category => dispatch({ type: SET_RECIPE_CATEGORY, category }),
    getRecipes: (requestType, users, activeUser, friendRecipes, createdRecipes) => dispatch({
      type: GET_RECIPES_REQUESTED, requestType
    })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);