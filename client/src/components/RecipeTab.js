import React from 'react';
import RecipeList from './RecipeList';
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
        {this.props.networkFailed
        ? <div style={errorStyle}>Network error</div>
        : <div>
            {this.props.isLoggedIn && <RecipeButtons />}
            <RecipeList recipes={this.props.displayRecipes}/>
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