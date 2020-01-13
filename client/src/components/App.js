import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import '../index.css';
import Button from '@material-ui/core/Button';
import Spinner from './Spinner';

class App extends React.Component {
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  render() {
    const buttonStyle = {
      fontSize:"15px",
      padding:"15px 20px",
      margin:"10px 5px"
    };
    const buttonRowStyle = { display:"inline" };
    return (
      <div className="App">
        <div className="App-header">
          <div style={buttonRowStyle}>
            <Button
              variant="contained"
              color="primary"
              style={buttonStyle}
            >
              Add User
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={buttonStyle}
              onClick={this.props.getRandomRecipe}
            >
              Get New Recipe
            </Button>
          </div>
          {this.props.isSpinnerVisible ?
            <Spinner /> : null
          }
          <img src={this.props.activeRecipe.image} alt="Recipe" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSpinnerVisible: state.isSpinnerVisible,
    fetchRecipeSuccess: state.fetchRecipeSuccess,
    activeRecipe: state.activeRecipe,
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
