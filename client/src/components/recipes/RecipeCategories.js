import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import { recipeButtonStyle } from '../../styles';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none',
    fontSize: '12px',
    fontFamily: 'Signika',
    borderRadius: '50px'
  }
}));

export default function RecipeCategories({ category, setCategory }) {
  const classes = useStyles();
  return (
    <div style={{
      position:'fixed',
      top:'0',
      zIndex:'2'
    }}>
      <Button
        className={classes.button}
        style={recipeButtonStyle(category, "All")}
        onClick={() => setCategory("All")}
      >
        All
      </Button>
      <Button
        className={classes.button}
        style={recipeButtonStyle(category, "By Friends")}
        onClick={() => setCategory("By Friends")}
      >
        By Friends
      </Button>
      <Button
        className={classes.button}
        style={recipeButtonStyle(category, "By Me")}
        onClick={() => setCategory("By Me")}
      >
        By Me
      </Button>
    </div>
  );
}