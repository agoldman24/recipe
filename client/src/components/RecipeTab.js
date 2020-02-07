import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import RecipeButtons from './RecipeButtons';
import { connect } from 'react-redux';

const RecipeTab = props => {
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
      >
        <Grid item>
          <RecipeCard/>
        </Grid>
      </Grid>
      {props.isLoggedIn && <RecipeButtons />}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  };
}

const mapDispatchToProps = dispatch => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);