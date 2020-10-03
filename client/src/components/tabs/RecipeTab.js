import React, { useEffect } from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeCategories from '../recipes/RecipeCategories';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import {
  SET_RECIPE_CATEGORY,
  GET_RECIPES_REQUESTED,
  TOGGLE_RECIPE_CREATE_MODE
} from '../../actions';
import { SAMPLE_RECIPES, FRIEND_RECIPES, CREATED_RECIPES } from '../../variables/Constants';
import { errorStyle } from '../../styles';

const RecipeTab = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRecipes();
  }, []);
  useEffect(() => {
    const id = isMobile ? 'root' : 'container';
    document.getElementById(id).scroll({ top: 0, left: 0 });
    fetchRecipes();
  }, [props.category]);
  
  const fetchRecipes = () => {
    let recipes, requestType;
    switch (props.category) {
      case "Anonymous":
        recipes = props.sampleRecipes;
        requestType = SAMPLE_RECIPES;
        break;
      case "By Friends":
        recipes = props.friendRecipes;
        requestType = FRIEND_RECIPES;
        break;
      case "By Me":
        recipes = props.createdRecipes;
        requestType = CREATED_RECIPES;
        break;
      default:
        break;
    }
    if (!recipes.length) {
      props.getRecipes(
        requestType,
        props.users,
        props.activeUser,
        props.friendRecipes,
        props.createdRecipes
      );
    }
  }
  let recipes;
  switch (props.category) {
    case "Anonymous":
      recipes = props.sampleRecipes;
      break;
    case "By Friends":
      recipes = props.friendRecipes;
      break;
    case "By Me":
      recipes = props.createdRecipes;
      break;
    default:
      break;
  }
  return (
    <div>
      {props.networkFailed
      ? <div style={errorStyle}>Network error</div>
      : <div>
          <RecipeList recipes={recipes}/>
          {props.isLoggedIn &&
            <RecipeCategories
              category={props.category}
              setCategory={props.setCategory}
              toggleCreateMode={props.toggleCreateMode}
            />
          }
        </div>
      }
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    networkFailed: state.errorMessages.networkFailed,
    category: state.recipeCategory,
    sampleRecipes: Object.values(state.sampleRecipes),
    friendRecipes: Object.values(state.friendRecipes).sort((r1, r2) => r2.timestamp - r1.timestamp),
    createdRecipes: Object.values(state.createdRecipes).sort((r1, r2) => r2.timestamp - r1.timestamp),
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