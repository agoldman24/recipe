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

export default function RecipeButtons() {
  const classes = useStyles();
  const [value, setValue] = React.useState('Samples');

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
        style={recipeButtonStyle(value, "By Me")}
        onClick={() => setValue("By Me")}
      >By Me</Button>
      <Button
        className={classes.button}
        style={recipeButtonStyle(value, "By Friends")}
        onClick={() => setValue("By Friends")}
      >By Friends</Button>
      <Button
        className={classes.button}
        style={recipeButtonStyle(value, "Samples")}
        onClick={() => setValue("Samples")}
      >Samples</Button>
      <Fab style={fabStyle}>
        <CreateIcon style={{height:'35', width:'35'}}/>
      </Fab>
    </div>
  );
}