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
      <Grid item style={{padding:'20px'}}>
        <Typography style={{fontFamily:'Raleway', fontSize:'20px', fontWeight:'bold'}}>
          RecipeBook is an online collection of recipes supplied by food enthusiasts wishing to share their culinary creations. Anyone with a desire to expand their cooking portfolio or simply decide what to make for dinner will find value in this digital hub of ideas. The site's content is facilitated by the exchange of recipes among users, especially those who are passionate about food and want to explore new cuisines. Creating an account is free and simple. Once registered, users can submit recipes by inputting the ingredients, directions, and photo of each finished product. To get started, visit <a href="https://recipebookapp.com">recipebookapp.com</a> and sign up!
        </Typography>
      </Grid>
    </Grid>
  );
}