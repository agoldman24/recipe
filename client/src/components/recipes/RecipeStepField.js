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

export default function RecipeStepField({
  originalValue,
  index,
  directionSteps,
  setDirectionSteps,
  setGlobalDiff,
  addStepMode,
  setAddStepMode,
  setAddEnabled
}) {
  const classes = useStyles();
  const [value, setValue] = useState(originalValue);
  useEffect(() => setValue(directionSteps[index]), [directionSteps, index]);
  return (
    <TextField
      InputProps={{
        classes: {
          input: classes.inputTextReducedPadding
        },
        onBlur: () => {
          let newDirectionSteps;
          if (!value.length) {
            newDirectionSteps = directionSteps.reduce((accum, step, i) => {
              if (i !== index) {
                accum.push(step);
              }
              return accum;
            }, []);
          } else {
            newDirectionSteps = directionSteps.reduce((accum, step, i) => {
              accum.push(i === index ? value : step);
              return accum;
            }, []);
          }
          setDirectionSteps(newDirectionSteps);
          setGlobalDiff({ newDirectionSteps });
          setAddStepMode(false);
          setAddEnabled(true);
        }
      }}
      id={"step_" + index}
      variant="outlined"
      color="secondary"
      style={fullWidth}
      autoFocus={addStepMode}
      value={value}
      onChange={e => {
        const val = e.target.value;
        setValue(val);
        setAddEnabled(!!val.length);
      }}
    />
  )
}