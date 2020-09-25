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
          let newIngredients;
          if (!value.length) {
            newIngredients = ingredients.reduce((accum, ingredient, i) => {
              if (i !== index) {
                accum.push(ingredient);
              }
              return accum;
            }, []);
          } else {
            newIngredients = ingredients.reduce((accum, { item, quantity }, i) => {
              accum.push(i === index
                ? { item: value, quantity }
                : { item, quantity }
              );
              return accum;
            }, []);
          }
          setIngredients(newIngredients);
          setGlobalDiff(undefined, undefined, newIngredients);
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