import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import RecipeButtons from './RecipeButtons';
import { connect } from 'react-redux';

const errorStyle = {
  textAlign:'center',
  color:'#ff2200',
  paddingTop:'50px'
};

const RecipeTab = props => {
  return (
    <div>
      <Grid
        container
        direction="column"
        style={{alignItems:'center'}}
      >
        {props.networkFailed
        ? <div style={errorStyle}>Network error</div>
        : Object.keys(props.activeRecipes)
          .sort((id1, id2) =>
            new Date(props.activeRecipes[id2].timestamp)
              - new Date(props.activeRecipes[id1].timestamp))
          .map(id => {
            const recipe = props.activeRecipes[id];
            return (
              <Grid item key={recipe.id}>
                {props.isDetailVisible && props.detailRecipeId === id &&
                  <RecipeDetail
                    id={id}
                    name={recipe.name}
                    image={recipe.image}
                    ingredients={recipe.ingredients}
                    directions={recipe.directions}
                  />
                }
                <RecipeCard
                  id={id}
                  name={recipe.name}
                  image={recipe.image}
                />
              </Grid>
            );
          })
        }
      </Grid>
      {props.isLoggedIn && <RecipeButtons />}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    networkFailed: state.errorMessages.networkFailed,
    activeRecipes: state.activeRecipes,
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
)(RecipeTab);