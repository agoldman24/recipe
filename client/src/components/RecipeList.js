import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import { connect } from 'react-redux';

const RecipeList = props => {
  return (
    <Grid
      container
      direction="column"
      style={{alignItems:'center', paddingBottom:'100px'}}
    >
      {Object.values(props.recipes)
        // Object.keys(this.props.activeRecipes)
        // .sort((id1, id2) =>
        //   new Date(this.props.activeRecipes[id2].timestamp)
        //     - new Date(this.props.activeRecipes[id1].timestamp))
        .map(recipe => {
          return (
            <Grid item key={recipe.id}>
              {props.isDetailVisible &&
                props.detailRecipeId === recipe.id &&
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
  );
}

const mapStateToProps = state => {
  return {
    networkFailed: state.errorMessages.networkFailed,
    isDetailVisible: state.isDetailVisible,
    detailRecipeId: state.detailRecipeId
  };
}

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);