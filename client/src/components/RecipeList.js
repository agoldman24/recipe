import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import { connect } from 'react-redux';
import { GET_RECIPES_REQUESTED } from '../actions';
import { RECIPE_TAB, SAMPLES, CREATED_RECIPES, SAVED_RECIPES } from "../variables/Constants";

const RecipeList = props => {
  return (
    <Grid
      container
      direction="column"
      style={{alignItems:'center', paddingBottom:'100px'}}
    >
      {props.recipes.map(recipe => {
        return (
          <Grid item key={recipe.id}>
            {props.isDetailVisible && props.detailRecipeId === recipe.id &&
              <RecipeDetail
                id={recipe.id}
                name={recipe.name}
                image={recipe.image}
                ingredients={recipe.ingredients}
                directions={recipe.directions}
              />
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
      {!props.allRecipesFetched &&
        <Link
          href="#"
          style={{ fontSize:'16px', paddingTop:'40px' }}
          onClick={() => {
            props.getRecipes(
              props.activeTab,
              props.displayUser,
              props.displayUserDetail
            )
          }}
        >
          Load more recipes
        </Link>
      }
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    networkFailed: state.errorMessages.networkFailed,
    isDetailVisible: state.isDetailVisible,
    detailRecipeId: state.detailRecipeId,
    activeTab: state.activeTab,
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    allRecipesFetched: (state.activeTab === RECIPE_TAB && state.allRecipesFetched.samples)
    || (!!state.displayUserDetail && 
      ((state.displayUserDetail.activeDetail === CREATED_RECIPES && state.allRecipesFetched.created)
      || (state.displayUserDetail.activeDetail === SAVED_RECIPES && state.allRecipesFetched.saved))
    )
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipes: (activeTab, displayUser, displayUserDetail) => dispatch({
      type: GET_RECIPES_REQUESTED,
      requestType: activeTab === RECIPE_TAB ? SAMPLES : SAVED_RECIPES,
      ids: activeTab === RECIPE_TAB
        ? null
        : displayUser.savedRecipeIds.filter(obj =>
            !Object.keys(displayUserDetail.savedRecipes).includes(obj.id)
          )
          .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
    }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);