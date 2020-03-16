import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import RecipeButtons from './RecipeButtons';
import { connect } from 'react-redux';
import { GET_RECIPES_REQUESTED } from '../actions';

const errorStyle = {
  textAlign:'center',
  color:'#ff2200',
  paddingTop:'50px'
};

class RecipeTab extends React.Component {
  componentDidMount() {
    if (!Object.keys(this.props.displayRecipes).length) {
      this.props.getRandomRecipe();
    }
  }
  render() {
    return (
      <div>
        {this.props.isLoggedIn && <RecipeButtons />}
        <Grid
          container
          direction="column"
          style={{alignItems:'center', paddingBottom:'100px'}}
        >
          {this.props.networkFailed
          ? <div style={errorStyle}>Network error</div>
          : Object.values(this.props.displayRecipes)
            // Object.keys(this.props.activeRecipes)
            // .sort((id1, id2) =>
            //   new Date(this.props.activeRecipes[id2].timestamp)
            //     - new Date(this.props.activeRecipes[id1].timestamp))
            .map(recipe => {
              return (
                <Grid item key={recipe.id}>
                  {this.props.isDetailVisible &&
                    this.props.detailRecipeId === recipe.id &&
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    networkFailed: state.errorMessages.networkFailed,
    displayRecipes: state.displayRecipes,
    isDetailVisible: state.isDetailVisible,
    detailRecipeId: state.detailRecipeId
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: GET_RECIPES_REQUESTED }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);