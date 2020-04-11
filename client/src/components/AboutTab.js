import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { gradientTextStyle } from '../variables/Constants';

const AboutTab = props => {
  return (
    <Grid
      container
      direction="column"
      style={{alignItems:'center'}}
    >
      <Grid item style={{marginBottom:'20px'}}>
        <Typography
          variant="h1"
          style={{
            fontWeight:'bold',
            fontFamily:'Shadows Into Light',
            ...gradientTextStyle
          }}
        >
          About
        </Typography>
      </Grid>
      <Typography>
        Recipe Book is a platform used for creating and sharing recipes
      </Typography>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {};
}

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutTab);