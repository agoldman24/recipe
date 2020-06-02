import React from 'react';
import RecipeList from './RecipeList';
import RecipeButtons from './RecipeButtons';
import { connect } from 'react-redux';
import { GET_RECIPES_REQUESTED } from '../../actions';
import { SAMPLES } from '../../variables/Constants';

const errorStyle = {
  textAlign:'center',
  color:'#ff2200',
  paddingTop:'50px'
};

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
            {this.props.isLoggedIn && <RecipeButtons />}
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
    detailRecipeId: state.detailRecipeId
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getSampleRecipes: () => dispatch({
      type: GET_RECIPES_REQUESTED,
      requestType: SAMPLES
    }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);