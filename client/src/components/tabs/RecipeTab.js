import React, { useEffect } from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeCategories from '../recipes/RecipeCategories';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { SET_RECIPE_CATEGORY, GET_RECIPES_REQUESTED } from '../../actions';
import { SAMPLE_RECIPES, FRIEND_RECIPES, CREATED_RECIPES } from '../../variables/Constants';
import { errorStyle } from '../../styles';

const RecipeTab = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRecipes();
  }, []);
  useEffect(() => {
    const id = isMobileOnly ? 'root' : 'container';
    document.getElementById(id).scroll({ top: 0, left: 0 });
    fetchRecipes();
  }, [props.category]);
  
  const fetchRecipes = () => {
    if (!Object.keys(props.recipes).length) {
      props.getRecipes(
        props.requestType,
        props.users,
        props.activeUser,
        props.friendRecipes,
        props.createdRecipes
      );
    }
  }

  return (
    <div>
      {props.networkFailed
      ? <div style={errorStyle}>Network error</div>
      : <div>
          <RecipeList recipes={props.recipes}/>
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
    friendRecipes: state.friendRecipes,
    createdRecipes: state.createdRecipes,
    recipes: state.recipeCategory === "Anonymous"
      ? state.sampleRecipes
      : state.recipeCategory === "By Friends"
        ? state.friendRecipes
        : state.createdRecipes,
    requestType: state.recipeCategory === "Anonymous"
      ? SAMPLE_RECIPES
      : state.recipeCategory === "By Friends"
        ? FRIEND_RECIPES
        : CREATED_RECIPES,
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
    })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);