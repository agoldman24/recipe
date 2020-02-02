import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import RecipeDetails from './RecipeDetails';
import { FETCH_RECIPE_REQUESTED } from '../actions';
import { isMobile } from 'react-device-detect';

class RecipeCard extends React.Component {
  componentDidMount() {
    if (!this.props.activeRecipe.id) {
      this.props.getRandomRecipe();
    }
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const cardStyle = isMobile ? { width:"90vw" } : { width:"43vw" };
    return (
      <Card inverted="true" style={cardStyle}>
        <CardHeader
          title={this.props.activeRecipe.name}
        />
        <CardMedia
          style={{height:"0", paddingTop:"56.25%"}}
          image={this.props.activeRecipe.image}
          children={[]}
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
    activeRecipe: state.activeRecipe
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeCard);