import React from 'react';
import { connect } from 'react-redux';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import logo from '../logo.svg';
import '../index.css';

class App extends React.Component {
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  render() {
    const buttonStyle = {fontSize:"50px", padding:"15px 20px"};
    const buttonRowStyle = {display:"inline"};
    return (
      <div className="App">
        <div className="App-header">
          <div style={buttonRowStyle}>
            <button
              className="ui inverted yellow icon button"
              style={buttonStyle}
              ref={buttonDOM => this.plusButton = buttonDOM}
              onClick={() => {
                this.plusButton.blur();
              }}
            >
              <i className="plus icon" />
            </button>
            <button
              className="ui inverted yellow icon button"
              style={buttonStyle}
              ref={buttonDOM => this.randomButton = buttonDOM}
              onClick={() => {
                this.props.getRandomRecipe();
                this.randomButton.blur();
              }}
            >
              <i className="random icon" />
            </button>
          </div>
          {this.props.isSpinnerVisible ?
            <img src={logo} className="App-logo" alt="logo" />
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
