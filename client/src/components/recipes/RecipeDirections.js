import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RecipeStepField from './RecipeStepField';
import RecipeParagraphField from './RecipeParagraphField';
import { directionsAreDifferent } from './utils';
import {
  borderStyle, sectionTitleStyle, radioLabelStyle, iconButtonStyle, addButtonStyle,
  rightSideActionStyle, fullWidth, errorMessageStyle, inputTheme
} from '../../styles';
import '../../index.css';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none'
  },
  wrapper: {
    width: '100%'
  }
}));

export default function RecipeDirections({
  focusedContainer,
  isDirectionsEmpty,
  isErrored,
  setGlobalDiff,
  setFocus,
  directionsType, setDirectionsType,
  directionSteps, setDirectionSteps,
  directionsParagraph, setDirectionsParagraph,
  originalDirections,
  isEditMode,
  handleStepDelete
}) {
  const classes = useStyles();
  const [addStepMode, setAddStepMode] = useState(false);
  const [addEnabled, setAddEnabled] = useState(true);
  return (
    <Grid container direction="row">
      <Grid item style={{
        width: focusedContainer !== "directions" &&
          isDirectionsEmpty && isErrored ? '65%' : '100%'
      }}>
        <Collapse
          in={focusedContainer === "directions"}
          classes={{wrapper: classes.wrapper}}
          style={borderStyle(
            focusedContainer,
            "directions",
            isDirectionsEmpty && isErrored
          )}
          collapsedHeight={50}
          onClick={e => {
            if (focusedContainer !== "directions") {
              e.stopPropagation();
              setFocus("directions");
            }
          }}
        >
          <Grid container direction="column">
            <Grid item style={{...fullWidth, padding:'10px'}}>
              <Typography
                style={{
                  ...sectionTitleStyle(focusedContainer, "directions"),
                  fontStyle: directionsAreDifferent(
                    directionsType,
                    directionsParagraph,
                    directionSteps,
                    originalDirections,
                    isEditMode
                  ) ? 'italic' : 'normal'
                }}
              >
                Directions*
              </Typography>
              <div style={rightSideActionStyle}>
                {focusedContainer === "directions"
                ? <FormControl component="fieldset">
                    <RadioGroup
                      value={directionsType === "string" ? "paragraph" : "step-by-step"}
                      onChange={e => {
                        if (directionsType === "object" &&
                          directionSteps.length &&
                          !directionSteps[directionSteps.length - 1].length
                        ) {
                          handleStepDelete(directionSteps.length - 1);
                        }
                        const newDirectionsType = e.target.value === "paragraph" ? "string" : "object";
                        setDirectionsType(newDirectionsType);
                        setGlobalDiff({ newDirectionsType });
                      }}
                    >
                      <FormControlLabel
                        value="step-by-step"
                        control={<Radio color="primary" />}
                        label="Step-by-Step"
                        style={radioLabelStyle(directionsType, "object")}
                      />
                      <FormControlLabel
                        value="paragraph"
                        control={<Radio color="primary" />}
                        label="Paragraph"
                        style={radioLabelStyle(directionsType, "string")}
                      />
                    </RadioGroup>
                  </FormControl>
                : <Fab
                    style={iconButtonStyle}
                    onClick={e => {
                      if (focusedContainer !== "directions") {
                        e.stopPropagation();
                        setFocus("directions");
                      }
                    }}
                  >
                    <ExpandMoreIcon />
                  </Fab>
                }
              </div>
            </Grid>
            <Grid item style={fullWidth}>
              <ThemeProvider theme={createMuiTheme(inputTheme)}>
                {directionsType === "string"
                ? <RecipeParagraphField
                    originalValue={directionsParagraph}
                    directionsParagraph={directionsParagraph}
                    setDirectionsParagraph={setDirectionsParagraph}
                    setGlobalDiff={setGlobalDiff}
                  />
                : <div style={{
                    maxHeight:'280px',
                    overflow:'auto',
                  }}>
                    <Grid container direction="column">
                      {directionSteps.map((step, index) => {
                      return (
                        <Grid container direction="row" key={index}>
                          <Grid item style={{width:'8%', paddingTop:'13px'}}>
                            <Typography style={{
                              float: 'right',
                              paddingRight: '5px',
                              fontSize: '16px'
                            }}>
                              {index + 1 + "."}
                            </Typography>
                          </Grid>
                          <Grid item style={{width:'80%', padding:'5px 0 5px 10px'}}>
                            <RecipeStepField
                              originalValue={step}
                              index={index}
                              autoFocus={addStepMode}
                              directionSteps={directionSteps}
                              setDirectionSteps={setDirectionSteps}
                              setGlobalDiff={setGlobalDiff}
                              addStepMode={addStepMode}
                              setAddStepMode={setAddStepMode}
                              setAddEnabled={setAddEnabled}
                            />
                          </Grid>
                          <Grid item style={{width:'8%', paddingTop:'7px'}}>
                            <Fab style={iconButtonStyle}>
                              <CloseIcon
                                onClick={e => {
                                  e.stopPropagation();
                                  handleStepDelete(index);
                                }}
                              />
                            </Fab>
                          </Grid>
                        </Grid>
                      )})}
                      <Button
                        startIcon={<AddIcon/>}
                        style={{
                          ...addButtonStyle,
                          opacity: addEnabled ? '1.0' : '0.3'
                        }}
                        disabled={!addEnabled}
                        onClick={() => {
                          setDirectionSteps([...directionSteps, ""]);
                          setAddStepMode(true);
                          setAddEnabled(false);
                        }}
                        className={classes.button}
                      >
                        Add Step
                      </Button>
                    </Grid>
                  </div>
                }
              </ThemeProvider>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
      {focusedContainer !== "directions" && isDirectionsEmpty && isErrored &&
        <Grid item style={errorMessageStyle}>
          Please enter at least one direction
        </Grid>
      }
    </Grid>
  )
}