import React from 'react';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import IngredientsTable from '../tables/IngredientsTable';
import PromptModal from '../popups/PromptModal';
import IconsModal from '../popups/IconsModal';
import FileBase from 'react-file-base64';
import { b64toBlob } from '../../utilities/imageConverter';
import {
  borderStyle, sectionTitleStyle, radioLabelStyle,
  fabStyle, buttonStyle, iconStyle, inputTheme
} from '../../styles';
import '../../index.css';

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
    '& .MuiInputLabel-root': {
      fontSize: '16px',
      color: 'white',
      marginTop: '-4px'
    }
  },
})(TextField);

const RecipeForms = props => {
  const classes = useStyles();
  const {
    originalName,
    originalImage,
    originalIngredients,
    originalDirections,
    tableRef,
    isEditMode,
    addIngredientMode, toggleAddIngredientMode,
    editIngredientMode, toggleEditIngredientMode,
    isIconsModalVisible, setIconsModalVisible,
    isFileTypeModalVisible, setFileTypeModalVisible,
    isDeleteIngredientModalVisible, setDeleteIngredientModalVisible,
    isDeleteStepModalVisible, setDeleteStepModalVisible,
    isNameFocused, setIsNameFocused,
    focusedContainer, setFocusedContainer,
    anchorEl, setAnchorEl,
    name, setName,
    image, setImage,
    directionsParagraph, setDirectionsParagraph,
    directionSteps, setDirectionSteps,
    focusedStep, setFocusedStep,
    directionsType, setDirectionsType,
    ingredients, setIngredients,
    deletedIndex, setDeletedIndex,
    addStepMode, setAddStepMode
  } = props;
  const containersDisabled = addIngredientMode || editIngredientMode;

  const onImageChange = file => {
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      setFileTypeModalVisible(true);
    } else {
      const data = file.base64.toString();
      setImage(URL.createObjectURL(b64toBlob(data)));
      setAnchorEl(null);
    }
  }

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

  const directionsAreDifferent = () => {
    if (isEditMode && directionsType !== typeof originalDirections) {
      return true;
    };
    if (directionsType === "string") {
      return directionsParagraph !== originalDirections;
    } else {
      if (directionSteps.length !== originalDirections.length) {
        return true;
      }
      directionSteps.forEach((direction, index) => {
        if (direction !== originalDirections[index]) {
          return true;
        }
      });
    }
    return false;
  }

  return (
    <div style={{width:'100%', height:'100%'}} onClick={() => setFocusedContainer(null)}>
      <IconsModal
        isVisible={isIconsModalVisible}
        closeModal={() => setIconsModalVisible(false)}
        onConfirm={icon => setImage(icon)}
      />
      <PromptModal
        modalType="okay"
        isVisible={isFileTypeModalVisible}
        closeModal={() => setFileTypeModalVisible(false)}
        message={"Invalid file type. Please choose a PNG or JPEG file."}
      />
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
          style={{
            opacity: containersDisabled ? '0.3' : '1.0',
            fontStyle: name === originalName || isNameFocused ? 'normal' : 'italic'
          }}
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
        onClick={e => {
          if (!(containersDisabled && focusedContainer !== "image")) {
            e.stopPropagation();
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
              style={{
                ...sectionTitleStyle(focusedContainer, "image", isNameFocused),
                fontStyle: image === originalImage ? 'normal' : 'italic'
              }}
            >
              Image*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "image"
              ? <Fab
                  style={iconButtonStyle}
                  onClick={e => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget)
                  }}
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
                  onClick={e => {
                    if (!(containersDisabled && focusedContainer !== "image")) {
                      e.stopPropagation();
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
        <Card style={{padding:'0 10px', width:'99%', marginLeft:'0.5%'}}>
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
        onClick={e => {
          if (!(containersDisabled && focusedContainer !== "ingredients")) {
            e.stopPropagation();
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
              style={{
                ...sectionTitleStyle(focusedContainer, "ingredients", isNameFocused),
                fontStyle: ingredients.length !== originalIngredients.length
                  || ingredients.filter(i => i.isModified).length ? 'italic' : 'normal'
              }}
            >
              Ingredients*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "ingredients"
              ? <Button
                  startIcon={<AddIcon/>}
                  style={{
                    ...addButtonStyle,
                    opacity: addIngredientMode || editIngredientMode ? '0.3' : '1.0'
                  }}
                  disabled={addIngredientMode || editIngredientMode}
                  onClick={() => {
                    document.getElementById("ingredients").scroll({ top: 0, behavior: 'smooth' });
                    toggleAddIngredientMode();
                  }}
                  className={classes.button}
                >
                  Add
                </Button>
              : <Fab
                  style={iconButtonStyle}
                  onClick={e => {
                    if (!(containersDisabled && focusedContainer !== "ingredients")) {
                      e.stopPropagation();
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
              width: '99%',
              marginLeft: '0.5%',
              overflow:'auto'
            }}>
            <IngredientsTable
              tableRef={tableRef}
              ingredients={ingredients}
              isEditable={true}
              editRowMode={editIngredientMode}
              addRowMode={addIngredientMode}
              toggleEditRowMode={toggleEditIngredientMode}
              toggleAddRowMode={toggleAddIngredientMode}
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
        onClick={e => {
          if (!(containersDisabled && focusedContainer !== "directions")) {
            e.stopPropagation();
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
              style={{
                ...sectionTitleStyle(focusedContainer, "directions", isNameFocused),
                fontStyle: directionsAreDifferent() ? 'italic' : 'normal'
              }}
            >
              Directions*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "directions"
              ? <FormControl component="fieldset">
                  <RadioGroup
                    value={directionsType === "string" ? "paragraph" : "step-by-step"}
                    onChange={e => setDirectionsType(e.target.value === "paragraph" ? "string" : "object")}
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
              {directionsType === "string"
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
                  maxHeight:'280px',
                  overflow:'auto',
                  padding:'0 0 10px 5px'
                }}>
                  <Grid container direction="column">
                    {directionSteps.map((step, index) => {
                    return (
                      <Grid container direction="row" key={index}>
                        <Grid item style={{width:'8%', paddingTop: '7px'}}>
                          <Fab style={iconButtonStyle}>
                            <DeleteOutlineIcon
                              onClick={e => {
                                e.stopPropagation();
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
                              },
                              onFocus: () => setFocusedStep(index),
                              onBlur: () => {
                                setFocusedStep(null);
                                setAddStepMode(false);
                              }
                            }}
                            id={"step_" + index}
                            variant="outlined"
                            color="secondary"
                            style={{width:'100%'}}
                            autoFocus={addStepMode}
                            error={!step.length}
                            helperText={step.length || focusedStep === index ? "" : "This step is empty"}
                            value={step}
                            onChange={e => {
                              let currentSteps = [ ...directionSteps ];
                              currentSteps[index] = e.target.value;
                              setDirectionSteps(currentSteps);
                            }}
                          />
                        </Grid>
                      </Grid>
                    )})}
                    <Grid container direction="row">
                      <Grid item style={{width:'16%'}}>
                        <Fab style={iconButtonStyle}
                          disabled={directionSteps.length && !directionSteps[directionSteps.length - 1].length}
                          onClick={() => {
                            setDirectionSteps([...directionSteps, ""]);
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
                        if (!directionSteps.length || directionSteps[directionSteps.length - 1].length) {
                          setDirectionSteps([...directionSteps, ""]);
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
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={e => {
          e.stopPropagation();
          setAnchorEl(null)
        }}
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
          <Grid item style={{background:'#292929', borderBottom: '1px solid white', padding:'10px'}}>
            <label className="fileContainer" style={{fontSize:'16px'}} onClick={e => e.stopPropagation()}>
              Upload Photo
              <FileBase type="file" onDone={onImageChange}/>
            </label>
          </Grid>
          <Grid item style={{background:'#292929'}}>
            <Button
              className={classes.button}
              style={{fontSize: '16px', width:'100%', fontFamily: 'Signika'}}
              onClick={e => {
                e.stopPropagation();
                setIconsModalVisible(true);
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
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeForms);