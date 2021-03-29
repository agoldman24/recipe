import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { inputStyle } from '../../styles';

const useStyles = makeStyles(() => inputStyle);

export default function RecipeServesField({
  focusedContainer,
  originalServes,
  setServes,
  setFocus,
  setGlobalDiff
}) {
  const classes = useStyles();
  const [value, setValue] = useState(originalServes);
  return (
    <TextField
      InputProps={{
        classes: {
          input: classes.inputText
        },
        onBlur: () => {
          setServes(value);
          setGlobalDiff({ newServes: value });
          setFocus(null);
        }
      }}
      classes={{
        root: focusedContainer === "serves"
          ? classes.yellowRoot
          : classes.whiteRoot
      }}
      style={{
        fontStyle: value === originalServes || focusedContainer === "serves" 
          ? 'normal' : 'italic'
      }}
      fullWidth
      variant="outlined"
      type="number"
      label="Serves"
      value={value}
      onClick={e => {
        e.stopPropagation();
        setFocus("serves");
      }}
      onChange={e => setValue(e.target.value)}
    />
  )
}