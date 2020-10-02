import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import RecipeDetailEdit from './RecipeDetailEdit';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { GET_RECIPES_REQUESTED } from '../../actions';
import {
  RECIPE_TAB, SAMPLE_RECIPES, FRIEND_RECIPES,
  CREATED_RECIPES, LIKED_RECIPES
} from "../../variables/Constants";

const RecipeList = props => {
  return (
    <div style={{paddingBottom: isMobile ? '100px' : '30px'}}>
      <Grid
        container
        direction={isMobile ? "column" : "row"}
        justify="center"
      >
        {props.recipes.map(recipe => {
          return (
            <Grid item key={recipe.id}
              style={{padding: isMobile ? '0' : '10px 5px 0 5px'}}
            >
              {props.isDetailVisible && props.detailRecipeId === recipe.id
                ? props.editMode
                  ? <RecipeDetailEdit
                      id={recipe.id}
                      name={recipe.name}
                      image={recipe.image}
                      ingredients={recipe.ingredients}
                      directions={recipe.directions}
                    />
                  : <RecipeDetail
                      id={recipe.id}
                      name={recipe.name}
                      image={recipe.image}
                      ingredients={recipe.ingredients}
                      directions={recipe.directions}
                    />
                : null
              }
              <RecipeCard
                id={recipe.id}
                name={recipe.name}
                image={recipe.image}
              />
            </Grid>
          );
        })
        }
      </Grid>
      {!props.allRecipesFetched &&
        <div style={{width:'100%', textAlign:'center', paddingTop:'20px'}}>
          <Link
            href="#"
            style={{fontSize:'16px'}}
            onClick={e => {
              e.preventDefault();
              props.getRecipes(
                props.activeTab,
                props.recipeCategory,
                props.friendRecipes,
                props.createdRecipes,
                props.users,
                props.activeUser,
                props.displayUser,
                props.displayUserDetail
              );
            }}
          >
            Load more recipes
          </Link>
        </div>
      }
    </div>
  );
}

const mapStateToProps = state => {
  return {
    networkFailed: state.errorMessages.networkFailed,
    isDetailVisible: !!state.detailRecipe.id,
    detailRecipeId: state.detailRecipe.id,
    editMode: state.detailRecipe.editMode,
    activeTab: state.activeTab,
    recipeCategory: state.recipeCategory,
    friendRecipes: state.friendRecipes,
    createdRecipes: state.createdRecipes,
    users: state.users,
    activeUser: state.activeUser,
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    allRecipesFetched:
      (state.activeTab.name === RECIPE_TAB && (
        (state.recipeCategory === "Anonymous" && state.allRecipesFetched.samples) ||
        (state.recipeCategory === "By Friends" && state.allRecipesFetched.friends) ||
        (state.recipeCategory === "By Me" && state.allRecipesFetched.created)
      )) ||
      (!!state.displayUserDetail && (
        (state.displayUserDetail.activeDetail === CREATED_RECIPES && state.allRecipesFetched.created) ||
        (state.displayUserDetail.activeDetail === LIKED_RECIPES && state.allRecipesFetched.liked)
      )
    )
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipes: (
      activeTab,
      recipeCategory,
      friendRecipes,
      createdRecipes,
      users,
      activeUser,
      displayUser,
      displayUserDetail
    ) => {
      const requestType = activeTab.name === RECIPE_TAB
        ? recipeCategory === "Anonymous"
          ? SAMPLE_RECIPES
          : recipeCategory === "By Friends"
            ? FRIEND_RECIPES
            : CREATED_RECIPES
        : displayUserDetail.activeDetail;
      let ids = null;
      switch (requestType) {
        case FRIEND_RECIPES:
          ids = activeUser.followingIds.reduce((accum, friendId) => {
            users[friendId].createdRecipeIds.filter(obj =>
              !Object.keys(friendRecipes).includes(obj.id)
            ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .forEach(r => accum.push(r));
            return accum;
          }, []);
          break;
        case CREATED_RECIPES:
          ids = activeUser.createdRecipeIds.filter(obj =>
            !Object.keys(createdRecipes).includes(obj.id)
          ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp);
          break;
        case LIKED_RECIPES:
          ids = displayUser.likedRecipeIds.filter(obj =>
            !Object.keys(displayUserDetail.likedRecipes).includes(obj.id)
          ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp);
          break;
        default:
          break;
      }
      dispatch({ type: GET_RECIPES_REQUESTED, requestType, ids });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);