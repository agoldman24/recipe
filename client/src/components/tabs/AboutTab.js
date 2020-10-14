import React from 'react';
import { isMobile } from 'react-device-detect';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { gradientTextStyle } from '../../styles';

export default function AboutTab(props) {
  return (
    <Grid
      container
      direction="column"
      style={{alignItems:'center', paddingTop:'50px'}}
    >
      <Grid item>
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
      <Grid item style={{padding: isMobile ? '10px 20px 100px 20px' : '20px'}}>
        <Typography style={{fontFamily:'Raleway', fontSize:'20px', fontWeight:'bold'}}>
          RecipeBook is an online collection of recipes supplied by food enthusiasts wishing to share their culinary creations. Anyone with a desire to expand their cooking portfolio or simply decide what to make for dinner will find value in this digital hub of ideas. The site's content is facilitated by the exchange of recipes among users, especially those who are passionate about food and want to explore new cuisines. Creating an account is free and simple. Once registered, you can submit recipes by entering the ingredients, directions, and photograph of each dish. Visit the <a href="#" onClick={props.visitSignup}>Sign Up</a> page to get started!
        </Typography>
      </Grid>
    </Grid>
  );
}