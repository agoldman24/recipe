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

export default function RecipeItemField({
  originalValue,
  index,
  ingredients,
  setIngredients,
  setGlobalDiff,
  addIngredientMode,
  setAddIngredientMode,
  setAddEnabled
}) {
  const classes = useStyles();
  const [value, setValue] = useState(originalValue);
  useEffect(() => setValue(ingredients[index].item), [ingredients]);
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
            currentIngredients[index].item = value;
          }
          setIngredients(currentIngredients);
          setGlobalDiff(undefined, undefined, ingredients);
          setAddIngredientMode(false);
          setAddEnabled(true);
        }
      }}
      id={"item_" + index}
      variant="outlined"
      color="secondary"
      placeholder="Item"
      style={fullWidth}
      autoFocus={addIngredientMode}
      value={value}
      onChange={e => {
        const val = e.target.value;
        setValue(val);
        setAddEnabled(!!val.length);
      }}
    />
  )
}