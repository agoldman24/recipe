import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';
import { recipeButtonStyle } from '../../styles';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none',
    fontSize: '16px',
    fontFamily: 'Signika',
    borderRadius: '0',
    padding: '15px'
  }
}));

const fabStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white'
};

export default function RecipeCategories({ category, setCategory, toggleCreateMode }) {
  const classes = useStyles();
  return (
    <div style={{
      position:'fixed',
      width:'100vw',
      bottom:'0',
      left:'0',
      backgroundImage:'linear-gradient(#202020, black)',
      textAlign:'center',
      zIndex:'1'
    }}>
      <Button
        className={classes.button}
        style={recipeButtonStyle(category, "All")}
        onClick={() => setCategory("All")}
      >All</Button>
      <Button
        className={classes.button}
        style={recipeButtonStyle(category, "By Friends")}
        onClick={() => setCategory("By Friends")}
      >By Friends</Button>
      <Button
        className={classes.button}
        style={recipeButtonStyle(category, "By Me")}
        onClick={() => setCategory("By Me")}
      >By Me</Button>
      <Fab style={fabStyle} onClick={toggleCreateMode}>
        <CreateIcon style={{height:'35', width:'35'}}/>
      </Fab>
    </div>
  );
}