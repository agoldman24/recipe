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
          const newIngredients = ingredients.reduce((accum, { item, quantity }, i) => {
            accum.push(i === index
              ? { item, quantity: value }
              : { item, quantity }
            );
            return accum;
          }, []);
          setIngredients(newIngredients);
          setGlobalDiff(undefined, undefined, newIngredients);
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