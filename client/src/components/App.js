import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import '../index.css';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';

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
            <div>
              <div
                className="ui segment"
                style={{
                  position:"fixed",
                  opacity:"0.5",
                  top:"0",
                  left:"0",
                  width:"100%",
                  height:"100%",
                  border:"none"
                }}
              >
                <div className="ui active dimmer" />
              </div>
              <div
                className="ui active inverted massive text loader"
                style={{
                  position:"fixed",
                  fontSize:"50px"
                }}
              />
            </div>
            : null
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
