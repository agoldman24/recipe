import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { makeStyles, withStyles } from '@material-ui/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import IngredientsTable from '../tables/IngredientsTable';
import PromptModal from '../popups/PromptModal';
import {
  borderStyle, sectionTitleStyle, radioLabelStyle,
  fabStyle, buttonStyle, iconStyle, inputTheme
} from '../../styles';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white',
    marginTop: '3px'
  },
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

const rightSideActionStyle = {
  float: 'right',
  width: isMobile ? '40%' : '30%'
}

const addButtonStyle = {
  ...buttonStyle,
  width: '100%',
  color: '#45bbff',
  border: '2px solid #45bbff'
}

const iconButtonStyle = {
  ...fabStyle,
  color: 'white',
  float: 'right',
  height: '20px',
  width: '30px'
}

const itemStyle = {
  width: '100%'
}

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      }
    },
  },
})(TextField);

const RecipeForms = props => {
  const classes = useStyles();
  const [isDeleteIngredientModalVisible, setDeleteIngredientModalVisible] = useState(false);
  const [isDeleteStepModalVisible, setDeleteStepModalVisible] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [focusedContainer, setFocusedContainer] = useState("ingredients");
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(props.name);
  const [image, setImage] = useState(props.image);
  const [directionsParagraph, setDirectionsParagraph] = useState(
    typeof props.directions === "string" ? props.directions : ""
  );
  const [directionSteps, setDirectionSteps] = useState(
    typeof props.directions === "string" ? [] : props.directions
  );
  const [directionsType, setDirectionsType] = useState("paragraph");
  const [ingredients, setIngredients] = useState(props.ingredients);
  const [deletedIndex, setDeletedIndex] = useState(0);
  // const [addIngredientMode, setAddIngredientMode] = useState(false);
  // const [editIngredientMode, setEditIngredientMode] = useState(false);
  // const [addDirectionMode, setAddDirectionMode] = useState(false);
  const [newStep, setNewStep] = useState("");
  const containersDisabled = props.addIngredientMode || props.editIngredientMode || props.addDirectionMode;

  const handleIngredientChange = ingredient => {
    let newIngredients = [...ingredients];
    newIngredients[ingredient.index] = ingredient;
    setIngredients(newIngredients);
  }

  const handleIngredientAdd = ingredient => {
    let newIngredients = ingredients.map(i => ({ ...i, index: i.index + 1 }));
    setIngredients([ingredient, ...newIngredients]);
  }

  const handleIngredientDelete = index => {
    setDeleteIngredientModalVisible(false);
    setIngredients(ingredients.reduce((accum, ingredient) => {
      if (ingredient.index !== index) {
        accum.push(ingredient)
      }
      return accum;
    }, []).map((ingredient, index) => ({
      ...ingredient, index
    })));
  }

  const handleStepDelete = index => {
    setDeleteStepModalVisible(false);
    let currentSteps = [ ...directionSteps ];
    currentSteps.splice(index, 1);
    setDirectionSteps(currentSteps);
  }

  return (
    <div>
      <PromptModal
        modalType="delete"
        isVisible={isDeleteIngredientModalVisible}
        closeModal={() => setDeleteIngredientModalVisible(false)}
        onConfirm={handleIngredientDelete}
        onConfirmParam={deletedIndex}
        message={isDeleteIngredientModalVisible
          ? "Are you sure you want to delete item '" + ingredients[deletedIndex].item + "'?"
          : ""
        }
      />
      <PromptModal
        modalType="delete"
        isVisible={isDeleteStepModalVisible}
        closeModal={() => setDeleteStepModalVisible(false)}
        onConfirm={handleStepDelete}
        onConfirmParam={deletedIndex}
        message={isDeleteStepModalVisible
          ? "Are you sure you want to delete Step " + (deletedIndex + 1) + "?"
          : ""
        }
      />
      <div style={{display:'flex', margin:'15px 10px 10px 10px'}}>
        <CssTextField
          InputProps={{
            classes: {
              input: classes.inputText
            }
          }}
          style={{opacity: containersDisabled ? '0.3' : '1.0'}}
          variant="outlined"
          required
          fullWidth
          label="Name"
          type="name"
          value={name}
          onClick={() => setIsNameFocused(true)}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <Collapse
        in={focusedContainer === "image"}
        classes={{wrapper: classes.wrapper}}
        style={borderStyle(
          focusedContainer,
          "image",
          containersDisabled && focusedContainer !== "image",
          isNameFocused
        )}
        collapsedHeight={50}
        onClick={() => {
          if (!(containersDisabled && focusedContainer !== "image")) {
            setIsNameFocused(false);
            setFocusedContainer("image");
          }
        }}
      >
        <Grid
          container
          direction="column"
          style={{opacity: containersDisabled && focusedContainer !== "image" ? '0.3' : '1.0'}}
        >
          <Grid item style={{...itemStyle, padding:'10px 10px 5px 10px'}}>
            <Typography
              style={sectionTitleStyle(focusedContainer, "image", isNameFocused)}
            >
              Image*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "image"
              ? <Fab
                  style={iconButtonStyle}
                  onClick={e => setAnchorEl(e.currentTarget)}
                >
                  <MenuRoundedIcon
                    style={{
                      ...iconStyle,
                      background: !!anchorEl ? '#292929' : 'none'
                    }}
                  />
                </Fab>
              : <Fab
                  style={iconButtonStyle}
                  onClick={() => {
                    if (!(containersDisabled && focusedContainer !== "image")) {
                      setIsNameFocused(false);
                      setFocusedContainer("image");
                    }
                  }}
                >
                  <ExpandMoreIcon />
                </Fab>
              }
            </div>
          </Grid>
        </Grid>
        <Card style={{padding:'0 10px', marginRight:'0.1px'}}>
          <CardMedia
            image={image}
            style={{
              height: isMobile ? '320px' : '280px',
              padding:'0',
              borderRadius:'10px 10px 0 0'
            }}
          />
        </Card>
      </Collapse>
      <Collapse
        in={focusedContainer === "ingredients"}
        classes={{wrapper: classes.wrapper}}
        style={borderStyle(
          focusedContainer,
          "ingredients",
          containersDisabled && focusedContainer !== "ingredients",
          isNameFocused
        )}
        collapsedHeight={50}
        onClick={() => {
          if (!(containersDisabled && focusedContainer !== "ingredients")) {
            setIsNameFocused(false);
            setFocusedContainer("ingredients");
          }
        }}
      >
        <Grid
          container
          direction="column"
          style={{opacity: containersDisabled && focusedContainer !== "ingredients" ? '0.3' : '1.0'}}
        >
          <Grid item style={{...itemStyle, padding:'10px'}}>
            <Typography
              style={sectionTitleStyle(focusedContainer, "ingredients", isNameFocused)}
            >
              Ingredients*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "ingredients"
              ? <Button
                  startIcon={<AddIcon/>}
                  style={{
                    ...addButtonStyle,
                    opacity: props.addIngredientMode || props.editIngredientMode || props.addDirectionMode ? '0.3' : '1.0'
                  }}
                  disabled={props.addIngredientMode || props.editIngredientMode || props.addDirectionMode}
                  onClick={() => {
                    document.getElementById("ingredients").scroll({ top: 0, behavior: 'smooth' });
                    props.toggleAddIngredientMode();
                  }}
                  className={classes.button}
                >
                  Add
                </Button>
              : <Fab
                  style={iconButtonStyle}
                  onClick={() => {
                    if (!(containersDisabled && focusedContainer !== "ingredients")) {
                      setIsNameFocused(false);
                      setFocusedContainer("ingredients");
                    }
                  }}
                >
                  <ExpandMoreIcon />
                </Fab>
              }
            </div>
          </Grid>
          <Grid item id="ingredients"
            style={{
              ...itemStyle,
              maxHeight: isMobile ? '320px' : '280px',
              overflow:'auto'
            }}>
            <IngredientsTable
              tableRef={props.tableRef}
              ingredients={ingredients}
              isEditable={true}
              editMode={props.editMode}
              editRowMode={props.editIngredientMode}
              addRowMode={props.addIngredientMode}
              toggleEditRowMode={props.toggleEditIngredientMode}
              toggleAddRowMode={props.toggleAddIngredientMode}
              onIngredientChange={handleIngredientChange}
              onIngredientAdd={handleIngredientAdd}
              onIngredientDelete={i => {
                setDeletedIndex(i);
                setDeleteIngredientModalVisible(true);
              }}
            />
          </Grid>
        </Grid>
      </Collapse>
      <Collapse
        in={focusedContainer === "directions"}
        classes={{wrapper: classes.wrapper}}
        style={borderStyle(
          focusedContainer,
          "directions",
          containersDisabled && focusedContainer !== "directions",
          isNameFocused
        )}
        collapsedHeight={50}
        onClick={() => {
          if (!(containersDisabled && focusedContainer !== "directions")) {
            setIsNameFocused(false);
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
          <Grid item style={{...itemStyle, padding:'10px'}}>
            <Typography
              style={sectionTitleStyle(focusedContainer, "directions", isNameFocused)}
            >
              Directions*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "directions"
              ? <FormControl component="fieldset">
                  <RadioGroup
                    value={directionsType}
                    onChange={e => setDirectionsType(e.target.value)}
                  >
                    <FormControlLabel
                      value="step-by-step"
                      control={<Radio color="primary" />}
                      label="Step-by-Step"
                      style={radioLabelStyle(directionsType, "step-by-step")}
                    />
                    <FormControlLabel
                      value="paragraph"
                      control={<Radio color="primary" />}
                      label="Paragraph"
                      style={radioLabelStyle(directionsType, "paragraph")}
                    />
                  </RadioGroup>
                </FormControl>
              : <Fab
                  style={iconButtonStyle}
                  onClick={() => {
                    if (!(containersDisabled && focusedContainer !== "directions")) {
                      setIsNameFocused(false);
                      setFocusedContainer("directions");
                    }
                  }}
                >
                  <ExpandMoreIcon />
                </Fab>
              }
              </div>
          </Grid>
          <Grid item style={itemStyle}>
            <ThemeProvider theme={createMuiTheme(inputTheme)}>
              {directionsType === "paragraph"
              ? <TextField
                  InputProps={{
                    classes: {
                      root: classes.multilineTextField,
                      input: classes.multilineInputText
                    }
                  }}
                  style={{width:'95%', margin:'0 2.5% 10px 2.5%'}}
                  variant="outlined"
                  color="secondary"
                  multiline
                  rowsMax={10}
                  value={directionsParagraph}
                  onChange={e => setDirectionsParagraph(e.target.value)}
                />
              : <div style={{
                  display:'flex',
                  WebkitFlexDirection:'column-reverse',
                  maxHeight:'280px',
                  overflow:'auto',
                  padding:'0 0 10px 5px'
                }}>
                  <Grid container direction="column">
                    {directionSteps.map((step, index) => {
                    return (
                      <Grid container direction="row" key={index}
                        style={{opacity: props.addDirectionMode ? '0.3' : '1.0'}}
                      >
                        <Grid item style={{width:'8%', paddingTop: '7px'}}>
                          <Fab style={iconButtonStyle}>
                            <DeleteOutlineIcon
                              onClick={() => {
                                setDeletedIndex(index);
                                setDeleteStepModalVisible(true);
                              }}
                            />
                          </Fab>
                        </Grid>
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
                              }
                            }}
                            variant="outlined"
                            color="secondary"
                            style={{width:'100%'}}
                            value={step}
                            onChange={e => {
                              let currentSteps = [ ...directionSteps ];
                              currentSteps[index] = e.target.value;
                              setDirectionSteps(currentSteps);
                            }}
                          />
                        </Grid>
                      </Grid>
                    );
                    })}
                    {props.addDirectionMode
                    ? <Grid container direction="row">
                        <Grid item style={{width:'8%', paddingTop: '7px'}}>
                          <Fab style={iconButtonStyle}>
                            <CloseIcon onClick={props.toggleAddDirectionMode}/>
                          </Fab>
                        </Grid>
                        <Grid item style={{width:'8%', paddingTop: '7px'}}>
                          <Fab style={iconButtonStyle}>
                            <CheckIcon onClick={() => {
                              let currentSteps = [ ...directionSteps ];
                              currentSteps.push(newStep);
                              setDirectionSteps(currentSteps);
                              props.toggleAddDirectionMode();
                              setNewStep("");
                            }}/>
                          </Fab>
                        </Grid>
                        <Grid item style={{width:'80%', padding: '5px 0 5px 15px'}}>
                          <TextField
                            InputProps={{
                              classes: {
                                input: classes.inputTextReducedPadding
                              }
                            }}
                            variant="outlined"
                            color="secondary"
                            autoFocus
                            fullWidth
                            value={newStep}
                            onChange={e => setNewStep(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    : <Grid container direction="row">
                        <Grid item style={{width:'16%'}}>
                          <Fab style={iconButtonStyle} onClick={props.toggleAddDirectionMode}>
                            <AddIcon/>
                          </Fab>
                        </Grid>
                        <Grid item style={{
                          cursor: 'pointer',
                          margin: '7px 10px',
                          fontSize: '16px',
                          color: '#b5b5b5'
                        }} onClick={props.toggleAddDirectionMode}>
                          Add step...
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </div>
              }
            </ThemeProvider>
          </Grid>
        </Grid>
      </Collapse>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.paper
        }}
      >
        <Grid container direction="column">
          <Grid item style={{background:'#292929', borderBottom: '1px solid white'}}>
            <Button
              className={classes.button}
              style={{fontSize: '16px'}}
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              Upload photo
            </Button>
          </Grid>
          <Grid item style={{background:'#292929'}}>
            <Button
              className={classes.button}
              style={{fontSize: '16px', paddingRight:'0'}}
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              Choose icon
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    editMode: state.detailRecipe.editMode
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeForms);