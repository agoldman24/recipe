import React from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeCategories from '../recipes/RecipeCategories';
import { connect } from 'react-redux';
import {
  SET_RECIPE_CATEGORY,
  GET_RECIPES_REQUESTED,
  TOGGLE_RECIPE_CREATE_MODE
} from '../../actions';
import { SAMPLE_RECIPES, FRIEND_RECIPES, CREATED_RECIPES } from '../../variables/Constants';
import { errorStyle } from '../../styles';

class RecipeTab extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchRecipes();
  }
  componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      this.fetchRecipes();
    }
  }
  fetchRecipes() {
    let recipes, requestType;
    switch (this.props.category) {
      case "Anonymous":
        recipes = this.props.sampleRecipes;
        requestType = SAMPLE_RECIPES;
        break;
      case "By Friends":
        recipes = this.props.friendRecipes;
        requestType = FRIEND_RECIPES;
        break;
      case "By Me":
        recipes = this.props.createdRecipes;
        requestType = CREATED_RECIPES;
        break;
      default:
        break;
    }
    if (!recipes.length) {
      this.props.getRecipes(
        requestType,
        this.props.users,
        this.props.activeUser,
        this.props.friendRecipes,
        this.props.createdRecipes
      );
    }
  }
  render() {
    let recipes;
    switch (this.props.category) {
      case "Anonymous":
        recipes = this.props.sampleRecipes;
        break;
      case "By Friends":
        recipes = this.props.friendRecipes;
        break;
      case "By Me":
        recipes = this.props.createdRecipes;
        break;
      default:
        break;
    }
    return (
      <div>
        {this.props.networkFailed
        ? <div style={errorStyle}>Network error</div>
        : <div>
            <RecipeList recipes={recipes}/>
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
    sampleRecipes: Object.values(state.sampleRecipes),
    friendRecipes: Object.values(state.friendRecipes),
    createdRecipes: !!state.activeUser && !!Object.keys(state.createdRecipes).length
      ? state.activeUser.createdRecipeIds.sort(
          (obj1, obj2) => obj2.timestamp - obj1.timestamp
        ).map(obj => state.createdRecipes[obj.id])
      : [],
    isDetailVisible: !!state.detailRecipe.id,
    detailRecipeId: state.detailRecipe.id,
    users: state.users,
    activeUser: state.activeUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setCategory: category => dispatch({ type: SET_RECIPE_CATEGORY, category }),
    getRecipes: (requestType, users, activeUser, friendRecipes, createdRecipes) => dispatch({
      type: GET_RECIPES_REQUESTED,
      requestType,
      ids: requestType === SAMPLE_RECIPES
        ? null
        : requestType === FRIEND_RECIPES
          ? activeUser.followingIds.reduce((accum, friendId) => {
            users[friendId].createdRecipeIds.filter(obj =>
              !Object.keys(friendRecipes).includes(obj.id)
            ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .forEach(r => accum.push(r));
            return accum;
          }, [])
          : activeUser.createdRecipeIds.filter(obj =>
              !Object.keys(createdRecipes).includes(obj.id)
            ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
    }),
    toggleCreateMode: () => dispatch({ type: TOGGLE_RECIPE_CREATE_MODE })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);