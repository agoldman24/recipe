import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { makeStyles, withStyles } from '@material-ui/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IngredientsTable from '../tables/IngredientsTable';
import {
  TOGGLE_INGREDIENTS_EDIT_ROW_MODE,
  TOGGLE_INGREDIENTS_ADD_ROW_MODE,
  TOGGLE_MODAL
} from '../../actions';
import {
  borderStyle, sectionTitleStyle, radioLabelStyle, fabStyle, buttonStyle
} from '../../styles';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none'
  },
  inputText: {
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '15px 10px'
  },
  multilineTextField: {
    padding: '10px 5px 10px 15px'
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

const expandIconStyle = {
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
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [focusedContainer, setFocusedContainer] = useState("ingredients");
  const [name, setName] = useState(props.name);
  const [directions, setDirections] = useState(props.directions);
  const [dirType, setDirType] = useState("paragraph");
  const containersDisabled = props.editRowMode || props.addRowMode;
  return (
    <div>
      <div style={{display:'flex', margin:'15px 10px 10px 10px'}}>
        <CssTextField
          InputProps={{
            classes: {
              input: classes.inputText
            }
          }}
          style={{
            border: containersDisabled ? '1px solid rgba(255,255,255,0.3)' : '1px solid white'
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
      >
        <Grid
          container
          direction="column"
          style={{
            height: '400px',
            opacity: containersDisabled && focusedContainer !== "image" ? '0.3' : '1.0'
          }}
          onClick={() => {
            if (!(containersDisabled && focusedContainer !== "image")) {
              setIsNameFocused(false);
              setFocusedContainer("image");
            }
          }}
        >
          <Grid item style={{...itemStyle, padding:'10px'}}>
            <Typography
              style={sectionTitleStyle(focusedContainer, "image", isNameFocused)}
            >
              Image*
            </Typography>
            <div style={rightSideActionStyle}>
              {focusedContainer === "image"
              ? null
              : <Fab
                  style={expandIconStyle}
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
      >
        <Grid
          container
          direction="column"
          style={{opacity: containersDisabled && focusedContainer !== "ingredients" ? '0.3' : '1.0'}}
          onClick={() => {
            if (!(containersDisabled && focusedContainer !== "ingredients")) {
              setIsNameFocused(false);
              setFocusedContainer("ingredients");
            }
          }}
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
                    opacity: props.editRowMode || props.addRowMode ? '0.3' : '1.0'
                  }}
                  disabled={props.editRowMode || props.addRowMode}
                  onClick={() => {
                    document.getElementById("ingredients").scroll({ top: 0, behavior: 'smooth' });
                    props.toggleAddRowMode();
                  }}
                  className={classes.button}
                >
                  Add
                </Button>
              : <Fab
                  style={expandIconStyle}
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
          <Grid id="ingredients" item style={{...itemStyle, maxHeight:'365px', overflow:'auto'}}>
            <IngredientsTable
              tableRef={props.tableRef}
              ingredients={props.ingredients}
              isEditable={true}
              editMode={props.editMode}
              editRowMode={props.editRowMode}
              addRowMode={props.addRowMode}
              toggleEditRowMode={props.toggleEditRowMode}
              toggleAddRowMode={props.toggleAddRowMode}
              toggleModal={props.toggleModal}
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
      >
        <Grid
          container
          direction="column"
          style={{opacity: containersDisabled && focusedContainer !== "image" ? '0.3' : '1.0'}}
          onClick={() => {
            if (!(containersDisabled && focusedContainer !== "directions")) {
              setIsNameFocused(false);
              setFocusedContainer("directions");
            }
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
                    value={dirType}
                    onChange={e => setDirType(e.target.value)}
                  >
                    <FormControlLabel
                      value="step-by-step"
                      control={<Radio color="primary" />}
                      label="Step-by-Step"
                      style={radioLabelStyle(dirType, "step-by-step")}
                    />
                    <FormControlLabel
                      value="paragraph"
                      control={<Radio color="primary" />}
                      label="Paragraph"
                      style={radioLabelStyle(dirType, "paragraph")}
                    />
                  </RadioGroup>
                </FormControl>
              : <Fab
                  style={expandIconStyle}
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
            {dirType === "paragraph"
              ? <TextField
                  InputProps={{
                    classes: {
                      root: classes.multilineTextField,
                      input: classes.inputText
                    }
                  }}
                  style={{width:'95%', margin:'0 2.5% 10px 2.5%'}}
                  variant="outlined"
                  multiline
                  rowsMax={13}
                  value={directions}
                  onChange={e => setDirections(e.target.value)}
                />
              : null
            }
          </Grid>
        </Grid>
      </Collapse>
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
    toggleAddRowMode: () => dispatch({ type: TOGGLE_INGREDIENTS_ADD_ROW_MODE }),
    toggleModal: (actionName, actionPayload) => {
      dispatch({ type: TOGGLE_MODAL, actionName, actionPayload })
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeForms);