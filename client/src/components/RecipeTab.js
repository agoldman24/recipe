import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';
import RecipeButtons from './RecipeButtons';
import { connect } from 'react-redux';

const errorStyle = { textAlign:'center', color:'#ff2200', paddingTop:'50px' };

const RecipeTab = props => {
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
      >
        <Grid item>
          {props.networkFailed
            ? <div style={errorStyle}>Network error</div>
            : <RecipeCard/>
          }
        </Grid>
      </Grid>
      {props.isLoggedIn && <RecipeButtons />}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    networkFailed: state.networkFailed
  };
}

const mapDispatchToProps = dispatch => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeTab);