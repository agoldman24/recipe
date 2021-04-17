import React from 'react';
import { connect } from 'react-redux';
import RecipeList from '../recipes/RecipeList';
import { GET_RECIPES_REQUESTED } from '../../actions';
import { ALL_RECIPES, FRIEND_RECIPES, CREATED_RECIPES } from '../../variables/Constants';

class RecipeTab extends React.Component {
  componentDidMount() {
    document.getElementById('container').scrollTo(0, 0);
    this.fetchRecipes();
  }
  componentDidUpdate(prevProps) {
    if ((this.props.refreshNeeded && !prevProps.refreshNeeded) ||
      (this.props.recipeCategory !== prevProps.recipeCategory &&
        !Object.keys(this.props.recipes).length)
    ) {
      document.getElementById('container').scrollTo(0, 0);
      this.fetchRecipes();
    }
  }
  fetchRecipes = () => this.props.getRecipes(this.props.requestType);
  render() {
    return (
      <RecipeList recipes={Object.values(this.props.recipes)
        .sort((r1, r2) => r2.timestamp - r1.timestamp)}/>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    refreshNeeded: state.refreshNeeded,
    recipeCategory: state.recipeCategory,
    recipes: state.recipeCategory === "All"
      ? state.allRecipes
      : state.recipeCategory === "By Friends"
        ? state.friendRecipes
        : state.createdRecipes,
    requestType: state.recipeCategory === "All"
      ? ALL_RECIPES
      : state.recipeCategory === "By Friends"
        ? FRIEND_RECIPES
        : CREATED_RECIPES
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipes: requestType => dispatch({ type: GET_RECIPES_REQUESTED, requestType })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);