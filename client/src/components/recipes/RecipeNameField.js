import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { inputStyle, errorMessageStyle } from '../../styles';

const useStyles = makeStyles(() => inputStyle);

export default function RecipeNameField({
  focusedContainer,
  originalName,
  isNameEmpty,
  isErrored,
  setName,
  setFocus,
  setGlobalDiff
}) {
  const classes = useStyles();
  const [value, setValue] = useState(originalName);
  return (
    <Grid container direction="row">
      <Grid item style={{
        width: focusedContainer !== "name" && isNameEmpty && isErrored ? '65%' : '100%',
        paddingRight: focusedContainer !== "name" && isNameEmpty && isErrored ? '7px' : '0'
      }}>
        <TextField
          InputProps={{
            classes: {
              input: classes.inputText
            },
            onBlur: () => {
              setName(value);
              setGlobalDiff({ newName: value });
              setFocus(null);
            }
          }}
          classes={{
            root: focusedContainer === "name"
              ? classes.yellowRoot
              : isNameEmpty && isErrored
                ? classes.redRoot
                : classes.whiteRoot
          }}
          style={{
            fontStyle: value === originalName || focusedContainer === "name" 
              ? 'normal' : 'italic'
          }}
          required
          fullWidth
          variant="outlined"
          label="Title"
          value={value}
          onClick={e => {
            e.stopPropagation();
            setFocus("name");
          }}
          onChange={e => setValue(e.target.value)}
        />
      </Grid>
      {focusedContainer !== "name" && isNameEmpty && isErrored &&
        <Grid item
          style={{
            ...errorMessageStyle,
            paddingLeft:'3px',
          }}
        >
          Please enter a title
        </Grid>
      }
    </Grid>
  )
}