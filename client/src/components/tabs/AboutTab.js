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
      <Grid item style={{padding:'10px'}}>
        <Typography>
        RecipeBook is a website developed by Andrew Goldman with the goal of building a community-driven hub of delicious home-cooked meals. Anyone wishing to expand their culinary portfolio or simply decide what to cook for dinner one night will find value in this application. Its content is facilitated by the exchange of recipes among users, particularly those who are passionate about food and wish to share their ideas with the world. By creating a free RecipeBook account, you can submit and save customized recipes complete with images, ingredients, and directions and also "follow" other chefs to view the recipes they've created. You can also convert the ingredients of any given recipe into a digital shipping list to check items off of when you go to the grocery store. Visit recipebookapp.com to get started!
        </Typography>
      </Grid>
    </Grid>
  );
}