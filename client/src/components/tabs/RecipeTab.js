import React from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeCategories from '../recipes/RecipeCategories';
import { connect } from 'react-redux';
import {
  SET_RECIPE_CATEGORY,
  GET_RECIPES_REQUESTED,
  TOGGLE_RECIPE_CREATE_MODE
} from '../../actions';
import { SAMPLES } from '../../variables/Constants';
import { errorStyle } from '../../styles';

class RecipeTab extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    switch (this.props.category) {
      case "Anonymous":
        if (!Object.keys(this.props.sampleRecipes).length) {
          this.props.getSampleRecipes();
        }
        break;
      case "By Friends":
        break;
      case "By Me":
        break;
      default:
        break;
    }
  }
  render() {
    let recipes;
    switch (this.props.category) {
      case "Anonymous":
        recipes = Object.values(this.props.sampleRecipes);
        break;
      case "By Friends":
        recipes = [];
        break;
      case "By Me":
        recipes = [];
        break;
      default:
        recipes = [];
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
    sampleRecipes: state.sampleRecipes,
    isDetailVisible: !!state.detailRecipe.id,
    detailRecipeId: state.detailRecipe.id
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setCategory: category => dispatch({ type: SET_RECIPE_CATEGORY, category }),
    getSampleRecipes: () => dispatch({
      type: GET_RECIPES_REQUESTED,
      requestType: SAMPLES
    }),
    toggleCreateMode: () => dispatch({ type: TOGGLE_RECIPE_CREATE_MODE })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);