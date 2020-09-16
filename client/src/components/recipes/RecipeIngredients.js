import React from 'react';
import { isMobile } from 'react-device-detect';
import { makeStyles } from '@material-ui/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IngredientsTable from '../tables/IngredientsTable';
import {
  borderStyle, sectionTitleStyle, fabStyle, buttonStyle, errorMessageStyle
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

const fullWidth = {
  width: '100%'
}

export default function RecipeIngredients({
  focusedContainer,
  containersDisabled,
  originalIngredients,
  isIngredientsEmpty,
  isErrored,
  setFocus,
  tableRef, ingredients,
  editIngredientMode, toggleEditIngredientMode,
  addIngredientMode, toggleAddIngredientMode,
  handleIngredientChange,
  handleIngredientAdd,
  setDeletedIndex,
  setDeleteIngredientModalVisible
}) {
  const classes = useStyles();
  return (
    <Grid container direction="row">
      <Grid item style={{
        width: focusedContainer !== "ingredients" && isIngredientsEmpty && isErrored ? '65%' : '100%'
      }}>
        <Collapse
          in={focusedContainer === "ingredients"}
          classes={{wrapper: classes.wrapper}}
          style={borderStyle(
            focusedContainer,
            "ingredients",
            containersDisabled && focusedContainer !== "ingredients",
            isIngredientsEmpty && isErrored
          )}
          collapsedHeight={50}
          onClick={e => {
            if (!(containersDisabled && focusedContainer !== "ingredients")) {
              e.stopPropagation();
              setFocus("ingredients");
            }
          }}
        >
          <Grid
            container
            direction="column"
            style={{opacity: containersDisabled && focusedContainer !== "ingredients" ? '0.3' : '1.0'}}
          >
            <Grid item style={{...fullWidth, padding:'10px'}}>
              <Typography
                style={{
                  ...sectionTitleStyle(focusedContainer, "ingredients"),
                  fontStyle: ingredients.length !== originalIngredients.length
                    || ingredients.filter(i => i.isModified).length
                      ? 'italic'
                      : 'normal'
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
                        setFocus("ingredients");
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
                ...fullWidth,
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
      </Grid>
      {focusedContainer !== "ingredients" && isIngredientsEmpty && isErrored &&
        <Grid item
          style={{
            ...errorMessageStyle,
            opacity: containersDisabled ? '0.3' : '1.0'
          }}
        >
          Please enter at least one ingredient
        </Grid>
      }
    </Grid>
  )
}