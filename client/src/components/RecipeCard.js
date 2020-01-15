import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import RecipeDetails from './RecipeDetails';
import Spinner from './Spinner';
import { FETCH_RECIPE_REQUESTED } from '../actions';

class RecipeCard extends React.Component {
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return (
      <Card inverted style={{position:"relative", width:"90vw"}}>
        {this.props.isSpinnerVisible && <Spinner />}
        <CardHeader
          title={this.props.activeRecipe.name}
        />
        <CardMedia
          style={{height:"0", paddingTop:"56.25%"}}
          image={this.props.activeRecipe.image}
        />
        <RecipeDetails
          directions={this.props.activeRecipe.directions}
        />
      </Card>
    );
  }
};

const mapStateToProps = state => {
  return {
    isSpinnerVisible: state.isSpinnerVisible,
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
)(RecipeCard);