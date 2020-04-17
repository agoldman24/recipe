import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { GET_RECIPES_REQUESTED } from '../actions';
import { RECIPE_TAB, SAMPLES, CREATED_RECIPES, SAVED_RECIPES } from "../variables/Constants";

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