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
  TOGGLE_INGREDIENTS_EDIT_ROW_MODE,
  TOGGLE_INGREDIENTS_ADD_ROW_MODE
} from '../../actions';
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
  const [isModalVisible, setModalVisible] = useState(false);
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
  const [addIngredientMode, setAddIngredientMode] = useState(false);
  const [editIngredientMode, setEditIngredientMode] = useState(false);
  const [addDirectionMode, setAddDirectionMode] = useState(false);
  const [newStep, setNewStep] = useState("");
  const containersDisabled = addIngredientMode || editIngredientMode || addDirectionMode;

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
    setModalVisible(false);
    setIngredients(ingredients.reduce((accum, ingredient) => {
      if (ingredient.index !== index) {
        accum.push(ingredient)
      }
      return accum;
    }, []).map((ingredient, index) => ({
      ...ingredient, index
    })));
  }

  return (
    <div>
      <PromptModal
        isVisible={isModalVisible}
        toggleModal={setModalVisible}
        onConfirm={handleIngredientDelete}
        onConfirmParam={deletedIndex}
        message={isModalVisible
          ? "Are you sure you want to delete item '" + ingredients[deletedIndex].item + "'?"
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
                    opacity: addIngredientMode || editIngredientMode || addDirectionMode ? '0.3' : '1.0'
                  }}
                  disabled={addIngredientMode || editIngredientMode || addDirectionMode}
                  onClick={() => {
                    document.getElementById("ingredients").scroll({ top: 0, behavior: 'smooth' });
                    setAddIngredientMode(true);
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
              editRowMode={editIngredientMode}
              addRowMode={addIngredientMode}
              toggleEditRowMode={() => setEditIngredientMode(!editIngredientMode)}
              toggleAddRowMode={() => setAddIngredientMode(!addIngredientMode)}
              onIngredientChange={handleIngredientChange}
              onIngredientAdd={handleIngredientAdd}
              onIngredientDelete={i => {
                setDeletedIndex(i);
                setModalVisible(true);
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
                  flexDirection:'column',
                  maxHeight:'280px',
                  overflow:'auto',
                  padding:'0 0 10px 5px'
                }}>
                <Grid container direction="column">
                  {directionSteps.map((step, index) => {
                  return (
                    <Grid container direction="row" key={index}>
                      <Grid item style={{width:'8%', marginTop: '14px'}}>
                        <Fab style={iconButtonStyle}>
                          <DeleteOutlineIcon/>
                        </Fab>
                      </Grid>
                      <Grid item style={{width:'8%'}}>
                        <Typography style={{
                          marginTop: '20px',
                          float: 'right',
                          paddingRight: '5px',
                          fontSize: '16px'
                        }}>
                          {index + 1 + "."}
                        </Typography>
                      </Grid>
                      <Grid item style={{width:'80%', padding: '5px 0 5px 15px'}}>
                        <TextField
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
                  {addDirectionMode
                  ? <Grid container direction="row">
                      <Grid item style={{width:'8%', marginTop: '14px'}}>
                        <Fab style={iconButtonStyle}>
                          <CloseIcon onClick={() => setAddDirectionMode(false)}/>
                        </Fab>
                      </Grid>
                      <Grid item style={{width:'8%', marginTop: '14px'}}>
                        <Fab style={iconButtonStyle}>
                          <CheckIcon onClick={() => {
                            let currentSteps = [ ...directionSteps ];
                            currentSteps.push(newStep);
                            setDirectionSteps(currentSteps);
                            setAddDirectionMode(false);
                            setNewStep("");
                          }}/>
                        </Fab>
                      </Grid>
                      <Grid item style={{width:'80%', padding: '5px 0 5px 15px'}}>
                        <TextField
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          value={newStep}
                          onChange={e => setNewStep(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  : <Grid container direction="row">
                      <Grid item style={{width:'16%'}}>
                        <Fab style={iconButtonStyle} onClick={() => setAddDirectionMode(true)}>
                          <AddIcon/>
                        </Fab>
                      </Grid>
                      <Grid item style={{
                        margin: '7px 10px',
                        fontSize: '16px',
                        color: '#909090'
                      }} onClick={() => setAddDirectionMode(true)}>
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
    editMode: state.detailRecipe.editMode,
    editRowMode: state.detailRecipe.ingredients.editRowMode,
    addRowMode: state.detailRecipe.ingredients.addRowMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleEditRowMode: () => dispatch({ type: TOGGLE_INGREDIENTS_EDIT_ROW_MODE }),
    toggleAddRowMode: () => dispatch({ type: TOGGLE_INGREDIENTS_ADD_ROW_MODE })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeForms);