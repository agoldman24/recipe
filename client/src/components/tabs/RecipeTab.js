import React from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeButtons from '../recipes/RecipeButtons';
import { connect } from 'react-redux';
import { GET_RECIPES_REQUESTED, TOGGLE_RECIPE_CREATE_MODE } from '../../actions';
import { SAMPLES } from '../../variables/Constants';
import { errorStyle } from '../../styles';

class RecipeTab extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    if (!Object.keys(this.props.sampleRecipes).length) {
      this.props.getSampleRecipes();
    }
  }
  render() {
    return (
      <div>
        {this.props.networkFailed
        ? <div style={errorStyle}>Network error</div>
        : <div>
            <RecipeList recipes={Object.values(this.props.sampleRecipes)}/>
            {this.props.isLoggedIn &&
              <RecipeButtons
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
    sampleRecipes: state.sampleRecipes,
    isDetailVisible: state.isDetailVisible,
    detailRecipeId: state.detailRecipe.id
  };
}

const mapDispatchToProps = dispatch => {
  return {
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