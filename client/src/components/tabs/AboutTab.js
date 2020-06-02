import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { gradientTextStyle } from '../../styles';

export default function AboutTab() {
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