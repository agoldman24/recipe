import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { fullWidth } from '../../styles';

const useStyles = makeStyles(() => ({
  inputTextReducedPadding: {
    fontSize: '16px',
    padding: '10px'
  }
}));

export default function RecipeQuantityField({
  originalValue,
  index,
  ingredients,
  setIngredients,
  setGlobalDiff
}) {
  const classes = useStyles();
  const [value, setValue] = useState(originalValue);
  useEffect(() => setValue(ingredients[index].quantity), [ingredients]);
  return (
    <TextField
      InputProps={{
        classes: {
          input: classes.inputTextReducedPadding
        },
        onBlur: () => {
          let currentIngredients = [...ingredients];
          if (!value.length) {
            currentIngredients.splice(index, 1);
          } else {
            currentIngredients[index].quantity = value;
          }
          setIngredients(currentIngredients);
          setGlobalDiff(undefined, undefined, ingredients);
        }
      }}
      id={"quantity_" + index}
      variant="outlined"
      color="secondary"
      placeholder="Quantity"
      style={fullWidth}
      value={value}
      onChange={e => {
        const val = e.target.value;
        setValue(val);
      }}
    />
  )
}