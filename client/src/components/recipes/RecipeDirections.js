import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  borderStyle, sectionTitleStyle, radioLabelStyle, iconButtonStyle,
  rightSideActionStyle, fullWidth, errorMessageStyle, inputTheme
} from '../../styles';
import '../../index.css';

const useStyles = makeStyles(() => ({
  inputText: {
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '15px 10px'
  },
  inputTextReducedPadding: {
    fontSize: '16px',
    padding: '10px'
  },
  multilineInputText: {
    fontSize: '16px',
    lineHeight: '1.5'
  },
  multilineTextField: {
    padding: '10px 5px 10px 12px'
  },
  wrapper: {
    width: '100%'
  }
}));

export default function RecipeDirections({
  focusedContainer,
  containersDisabled,
  isDirectionsEmpty,
  isErrored,
  setGlobalDiff,
  setFocusedContainer,
  directionsType, setDirectionsType,
  directionSteps, setDirectionSteps,
  directionsParagraph, setDirectionsParagraph,
  originalDirections,
  directionsAreDifferent,
  isEditMode,
  addStepMode, setAddStepMode,
  focusedStep, setFocusedStep,
  handleStepDelete,
  setDeletedIndex,
  setDeleteStepModalVisible
}) {
  const classes = useStyles();
  const [paragraph, setParagraph] = useState(directionsParagraph);
  const [steps, setSteps] = useState(directionSteps);
  useEffect(() => setSteps(directionSteps), [directionSteps]);
  return (
    <Grid container direction="row">
      <Grid item style={{
        width: focusedContainer !== "directions" && isDirectionsEmpty && isErrored ? '65%' : '100%'
      }}>
        <Collapse
          in={focusedContainer === "directions"}
          classes={{wrapper: classes.wrapper}}
          style={borderStyle(
            focusedContainer,
            "directions",
            containersDisabled && focusedContainer !== "directions",
            isDirectionsEmpty && isErrored
          )}
          collapsedHeight={50}
          onClick={e => {
            if (!(containersDisabled && focusedContainer !== "directions")) {
              e.stopPropagation();
              setFocusedContainer("directions");
            }
          }}
        >
          <Grid
            container
            direction="column"
            style={{opacity: containersDisabled &&
              (focusedContainer !== "image" && focusedContainer !== "directions") ? '0.3' : '1.0'
            }}
          >
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
                        const newType = e.target.value === "paragraph" ? "string" : "object";
                        setDirectionsType(newType);
                        setGlobalDiff(undefined, undefined, undefined, newType, undefined, undefined);
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
                      if (!(containersDisabled && focusedContainer !== "directions")) {
                        e.stopPropagation();
                        setFocusedContainer("directions");
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
                ? <TextField
                    InputProps={{
                      classes: {
                        root: classes.multilineTextField,
                        input: classes.multilineInputText
                      },
                      onBlur: () => {
                        setDirectionsParagraph(paragraph);
                        setGlobalDiff(undefined, undefined, undefined, undefined, paragraph, undefined);
                      }
                    }}
                    style={{width:'95%', margin:'0 2.5% 10px 2.5%'}}
                    variant="outlined"
                    color="secondary"
                    multiline
                    rowsMax={10}
                    value={paragraph}
                    onChange={e => setParagraph(e.target.value)}
                  />
                : <div style={{
                    maxHeight:'280px',
                    overflow:'auto',
                    padding:'0 0 10px 5px'
                  }}>
                    <Grid container direction="column">
                      {steps.map((step, index) => {
                      return (
                        <Grid container direction="row" key={index}>
                          <Grid item style={{width:'8%', paddingTop: '13px'}}>
                            <Typography style={{
                              float: 'right',
                              paddingRight: '5px',
                              fontSize: '16px'
                            }}>
                              {index + 1 + "."}
                            </Typography>
                          </Grid>
                          <Grid item style={{width:'80%', padding: '5px 0 5px 15px'}}>
                            <TextField
                              InputProps={{
                                classes: {
                                  input: classes.inputTextReducedPadding
                                },
                                onFocus: () => setFocusedStep(index),
                                onBlur: () => {
                                  setDirectionSteps(steps);
                                  setGlobalDiff(undefined, undefined, undefined, undefined, undefined, steps);
                                  setFocusedStep(null);
                                  setAddStepMode(false);
                                }
                              }}
                              id={"step_" + index}
                              variant="outlined"
                              color="secondary"
                              style={fullWidth}
                              autoFocus={addStepMode}
                              error={!step.length && focusedStep !== index}
                              helperText={step.length || focusedStep === index ? "" : "This step is empty"}
                              value={step}
                              onChange={e => {
                                let currentSteps = [...steps];
                                currentSteps[index] = e.target.value;
                                setSteps(currentSteps);
                              }}
                            />
                          </Grid>
                          <Grid item style={{width:'8%', paddingTop: '7px'}}>
                            <Fab style={iconButtonStyle}>
                              <CloseIcon
                                onClick={e => {
                                  e.stopPropagation();
                                  setDeletedIndex(index);
                                  setDeleteStepModalVisible(true);
                                }}
                              />
                            </Fab>
                          </Grid>
                        </Grid>
                      )})}
                      <Grid container direction="row" style={{paddingBottom:'15px'}}>
                        <Grid item style={{width:'16%'}}>
                          <Fab style={iconButtonStyle}
                            disabled={steps.length && !steps[steps.length - 1].length}
                            onClick={() => {
                              setSteps([...steps, ""]);
                              setDirectionSteps([...steps, ""]);
                              setAddStepMode(true);
                            }}
                          >
                            <AddIcon/>
                          </Fab>
                        </Grid>
                        <Grid item style={{
                          width: '75%',
                          cursor: 'pointer',
                          margin: '7px 0 7px 15px',
                          fontSize: '16px',
                          color: '#b5b5b5'
                        }} onClick={() => {
                          if (!steps.length || steps[steps.length - 1].length) {
                            setSteps([...steps, ""]);
                            setDirectionSteps([...steps, ""]);
                            setAddStepMode(true);
                          }
                        }}>
                          Add step...
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                }
              </ThemeProvider>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
      {focusedContainer !== "directions" && isDirectionsEmpty && isErrored &&
        <Grid item
          style={{
            ...errorMessageStyle,
            opacity: containersDisabled ? '0.3' : '1.0'
          }}
        >
          Please enter at least one direction
        </Grid>
      }
    </Grid>
  )
}