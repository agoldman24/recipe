import React, { useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { makeStyles } from "@material-ui/styles";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RecipeItemField from "./RecipeItemField";
import RecipeQuantityField from "./RecipeQuantityField";
import { ingredientsAreDifferent } from "./utils";
import {
  borderStyle,
  sectionTitleStyle,
  errorMessageStyle,
  addButtonStyle,
  rightSideActionStyle,
  iconButtonStyle,
  inputTheme,
} from "../../styles";
import "../../index.css";

const useStyles = makeStyles(() => ({
  inputTextReducedPadding: {
    fontSize: "16px",
    padding: "10px",
  },
  button: {
    textTransform: "none",
  },
  wrapper: {
    width: "100%",
  },
}));

export default function RecipeIngredients({
  focusedContainer,
  originalIngredients,
  isIngredientsEmpty,
  isEditMode,
  isErrored,
  setGlobalDiff,
  setFocus,
  ingredients,
  setIngredients,
  handleIngredientDelete,
}) {
  const classes = useStyles();
  const [addIngredientMode, setAddIngredientMode] = useState(false);
  const [addEnabled, setAddEnabled] = useState(true);
  return (
    <Grid container direction="row">
      <Grid
        item
        style={{
          width:
            focusedContainer !== "ingredients" &&
            isIngredientsEmpty &&
            isErrored
              ? "65%"
              : "100%",
        }}
      >
        <Collapse
          in={focusedContainer === "ingredients"}
          classes={{ wrapper: classes.wrapper }}
          style={borderStyle(
            focusedContainer,
            "ingredients",
            isIngredientsEmpty && isErrored
          )}
          collapsedHeight={50}
          onClick={(e) => {
            if (focusedContainer !== "ingredients") {
              e.stopPropagation();
              setFocus("ingredients");
            }
          }}
        >
          <Grid container direction="column">
            <Grid item style={{ width: "100%", padding: "10px" }}>
              <Typography
                style={{
                  ...sectionTitleStyle(focusedContainer, "ingredients"),
                  fontStyle: ingredientsAreDifferent(
                    ingredients,
                    originalIngredients,
                    isEditMode
                  )
                    ? "italic"
                    : "normal",
                }}
              >
                Ingredients*
              </Typography>
              <div style={rightSideActionStyle}>
                {focusedContainer !== "ingredients" && (
                  <Fab
                    style={iconButtonStyle}
                    onClick={(e) => {
                      if (focusedContainer !== "ingredients") {
                        e.stopPropagation();
                        setFocus("ingredients");
                      }
                    }}
                  >
                    <ExpandMoreIcon />
                  </Fab>
                )}
              </div>
            </Grid>
            <Grid
              item
              id="ingredients"
              style={{
                maxHeight: isMobileOnly ? "320px" : "280px",
                width: "99%",
                marginLeft: "0.5%",
                overflow: "auto",
              }}
            >
              <ThemeProvider theme={createMuiTheme(inputTheme)}>
                <Grid container direction="column">
                  {ingredients.map(({ item, quantity }, index) => {
                    return (
                      <Grid container direction="row" key={index}>
                        <Grid
                          item
                          style={{ width: "45%", padding: "5px 0 5px 20px" }}
                        >
                          <RecipeItemField
                            originalValue={item}
                            index={index}
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            setGlobalDiff={setGlobalDiff}
                            addIngredientMode={addIngredientMode}
                            setAddIngredientMode={setAddIngredientMode}
                            setAddEnabled={setAddEnabled}
                          />
                        </Grid>
                        <Grid
                          item
                          style={{ width: "45%", padding: "5px 0 5px 5px" }}
                        >
                          <RecipeQuantityField
                            originalValue={quantity}
                            index={index}
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            setGlobalDiff={setGlobalDiff}
                          />
                        </Grid>
                        <Grid item style={{ width: "8%", paddingTop: "7px" }}>
                          <Fab style={iconButtonStyle}>
                            <CloseIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIngredientDelete(index);
                              }}
                            />
                          </Fab>
                        </Grid>
                      </Grid>
                    );
                  })}
                  <Button
                    startIcon={<AddIcon />}
                    style={{
                      ...addButtonStyle,
                      opacity: addEnabled ? "1.0" : "0.3",
                    }}
                    disabled={!addEnabled}
                    onClick={() => {
                      const newIngredients = [
                        ...ingredients,
                        { item: "", quantity: "" },
                      ];
                      setIngredients(newIngredients);
                      setAddIngredientMode(true);
                      setAddEnabled(false);
                    }}
                    className={classes.button}
                  >
                    Add Ingredient
                  </Button>
                </Grid>
              </ThemeProvider>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
      {focusedContainer !== "ingredients" && isIngredientsEmpty && isErrored && (
        <Grid item style={errorMessageStyle}>
          Please enter at least one ingredient
        </Grid>
      )}
    </Grid>
  );
}
