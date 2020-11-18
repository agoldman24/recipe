import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { errorStyle, errorMessageStyle, defaultTheme } from '../../styles';

const useStyles = makeStyles(() => ({
  inputText: {
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '15px 10px'
  },
  whiteRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: 'white',
      marginTop: '-4px'
    }
  },
  redRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: errorStyle.color,
      },
      '&:hover fieldset': {
        borderColor: errorStyle.color,
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: 'white',
      marginTop: '-4px'
    }
  },
  yellowRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: defaultTheme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: defaultTheme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: defaultTheme.palette.primary.main,
      marginTop: '-4px'
    }
  }
}));

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
    <Grid container direction="row"
      style={{display:'flex', padding:'15px 10px 5px 10px', width:'initial'}}
    >
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
              setGlobalDiff(value);
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
          label="Name"
          type="name"
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
          Please enter a name
        </Grid>
      }
    </Grid>
  )
}