import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from './actions';

class App extends React.Component {
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  render() {
    console.log(this.props.viewedRecipeIds);
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.props.getRandomRecipe}>Get Recipe</button>
          <img src={this.props.activeRecipe.image} alt="Recipe" />
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetchRecipeSuccess: state.fetchRecipeSuccess,
    activeRecipe: state.activeRecipe,
    viewedRecipeIds: state.viewedRecipeIds
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
