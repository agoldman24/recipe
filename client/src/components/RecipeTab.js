import React from 'react';
import Grid from '@material-ui/core/Grid';
import RecipeCard from './RecipeCard';

export default function RecipeTab() {
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
    </div>
  );
}