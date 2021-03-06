import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import PromptModal from "../popups/PromptModal";
import IconsModal from "../popups/IconsModal";
import RecipeNameField from "./RecipeNameField";
import RecipeServesField from "./RecipeServesField";
import RecipeImage from "./RecipeImage";
import RecipeIngredients from "./RecipeIngredients";
import RecipeDirections from "./RecipeDirections";
import imageCompression from "browser-image-compression";
import { b64toBlob } from "../../utilities/imageConverter";
import { directionsAreDifferent, ingredientsAreDifferent } from "./utils";
import "../../index.css";

const useStyles = makeStyles(() => ({
  button: {
    textTransform: "none",
  },
  paper: {
    borderRadius: "4px 0 4px 4px",
    border: "1px solid white",
    marginTop: "3px",
  },
}));

const blurFocusedElement = (e) => {
  if (e.key === "Enter" && !!document.activeElement)
    document.activeElement.blur();
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const RecipeForms = ({
  originalName,
  originalImage,
  originalIngredients,
  originalServes,
  originalDirections,
  isEditMode,
  setIsSaveEnabled,
  isErrored,
  isNameEmpty,
  setIsNameEmpty,
  isImageEmpty,
  setIsImageEmpty,
  isIngredientsEmpty,
  setIsIngredientsEmpty,
  isDirectionsEmpty,
  setIsDirectionsEmpty,
  name,
  setName,
  image,
  setImage,
  ingredients,
  setIngredients,
  serves,
  setServes,
  directionsType,
  setDirectionsType,
  directionsParagraph,
  setDirectionsParagraph,
  directionSteps,
  setDirectionSteps,
}) => {
  const classes = useStyles();
  const [isIconsModalVisible, setIconsModalVisible] = useState(false);
  const [isFileTypeModalVisible, setFileTypeModalVisible] = useState(false);
  const [focusedContainer, setFocusedContainer] = useState(
    isEditMode ? "image" : null
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElChanged, setAnchorElChanged] = useState(false);
  const prevAnchorEl = usePrevious(anchorEl);
  useEffect(() => setAnchorElChanged(prevAnchorEl !== anchorEl), [
    prevAnchorEl,
    anchorEl,
  ]);
  useEffect(() => {
    document.addEventListener("keydown", blurFocusedElement);
    return () => {
      document.removeEventListener("keydown", blurFocusedElement);
    };
  }, []);
  useEffect(() => {
    if (isIconsModalVisible) {
      document.removeEventListener("keydown", blurFocusedElement);
    } else {
      document.addEventListener("keydown", blurFocusedElement);
    }
  }, [isIconsModalVisible]);

  const setFocus = (container) => {
    if (container !== focusedContainer) {
      if (
        focusedContainer === "directions" &&
        directionsType === "object" &&
        directionSteps.length &&
        !directionSteps[directionSteps.length - 1].length
      ) {
        handleStepDelete(directionSteps.length - 1);
      } else if (
        focusedContainer === "ingredients" &&
        ingredients.length &&
        !ingredients[ingredients.length - 1].item.length
      ) {
        handleIngredientDelete(ingredients.length - 1);
      }
      setFocusedContainer(container);
    }
  };

  const setGlobalDiff = ({
    newName = name,
    newImage = image,
    newServes = serves,
    newIngredients = ingredients,
    newDirectionsType = directionsType,
    newDirectionsParagraph = directionsParagraph,
    newDirectionSteps = directionSteps,
  }) => {
    const ingredientsDiff = ingredientsAreDifferent(
      newIngredients,
      originalIngredients,
      isEditMode
    );
    const directionsDiff = directionsAreDifferent(
      newDirectionsType,
      newDirectionsParagraph,
      newDirectionSteps,
      originalDirections,
      isEditMode
    );
    setIsSaveEnabled(
      newName !== originalName ||
        newImage !== originalImage ||
        newServes !== originalServes ||
        ingredientsDiff ||
        directionsDiff
    );
    setIsNameEmpty(!newName.length);
    setIsImageEmpty(!newImage);
    setIsIngredientsEmpty(!newIngredients.length);
    setIsDirectionsEmpty(
      newDirectionsType === "string"
        ? !newDirectionsParagraph.length
        : !newDirectionSteps.length
    );
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      setFileTypeModalVisible(true);
    } else {
      setAnchorEl(null);
      setTimeout(async () => {
        const compressedFile = await imageCompression(file, { maxSizeMB: 1 });
        const data = await imageCompression.getDataUrlFromFile(compressedFile);
        const newImage = URL.createObjectURL(b64toBlob(data));
        setImage(newImage);
        setGlobalDiff({ newImage });
      }, 1);
    }
  };

  const handleIngredientDelete = (index) => {
    let newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setGlobalDiff({ newIngredients });
  };

  const handleStepDelete = (index) => {
    let newDirectionSteps = [...directionSteps];
    newDirectionSteps.splice(index, 1);
    setDirectionSteps(newDirectionSteps);
    setGlobalDiff({ newDirectionSteps });
  };

  const headerHeight = !!document.getElementById("editRecipeHeader")
    ? document.getElementById("editRecipeHeader").offsetHeight
    : 0;

  return (
    <ClickAwayListener
      onClickAway={(e) => {
        if (
          !anchorElChanged &&
          !isIconsModalVisible &&
          !isFileTypeModalVisible
        ) {
          setFocus(null);
          e.target.click();
        }
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#303030",
          height: "calc(100% - " + headerHeight + "px)",
        }}
      >
        <IconsModal
          isVisible={isIconsModalVisible}
          closeModal={() => setTimeout(() => setIconsModalVisible(false), 1)}
          onConfirm={(icon) => {
            setImage(icon);
            setGlobalDiff({ newImage: icon });
            setTimeout(() => setAnchorEl(null), 1);
          }}
        />
        <PromptModal
          modalType="okay"
          isVisible={isFileTypeModalVisible}
          closeModal={() => setTimeout(() => setFileTypeModalVisible(false), 1)}
          message={"Invalid file type. Please choose a PNG or JPEG file."}
        />
        <Grid
          container
          direction="row"
          style={{
            display: "flex",
            padding: "15px 10px 5px 10px",
            width: "initial",
          }}
        >
          <Grid item style={{ width: "75%" }}>
            <RecipeNameField
              focusedContainer={focusedContainer}
              originalName={originalName}
              isNameEmpty={isNameEmpty}
              isErrored={isErrored}
              setName={setName}
              setFocus={setFocus}
              setGlobalDiff={setGlobalDiff}
            />
          </Grid>
          <Grid item style={{ width: "25%", paddingLeft: "10px" }}>
            <RecipeServesField
              focusedContainer={focusedContainer}
              originalServes={originalServes}
              setServes={setServes}
              setFocus={setFocus}
              setGlobalDiff={setGlobalDiff}
            />
          </Grid>
        </Grid>
        <RecipeImage
          focusedContainer={focusedContainer}
          originalImage={originalImage}
          isImageEmpty={isImageEmpty}
          isErrored={isErrored}
          image={image}
          setImage={setImage}
          setFocus={setFocus}
          setGlobalDiff={setGlobalDiff}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setIconsModalVisible={setIconsModalVisible}
          onImageChange={onImageChange}
        />
        <RecipeIngredients
          focusedContainer={focusedContainer}
          originalIngredients={originalIngredients}
          isIngredientsEmpty={isIngredientsEmpty}
          isEditMode={isEditMode}
          isErrored={isErrored}
          setGlobalDiff={setGlobalDiff}
          setFocus={setFocus}
          ingredients={ingredients}
          setIngredients={setIngredients}
          handleIngredientDelete={handleIngredientDelete}
        />
        <RecipeDirections
          focusedContainer={focusedContainer}
          isDirectionsEmpty={isDirectionsEmpty}
          isErrored={isErrored}
          setGlobalDiff={setGlobalDiff}
          setFocus={setFocus}
          directionsType={directionsType}
          setDirectionsType={setDirectionsType}
          directionSteps={directionSteps}
          setDirectionSteps={setDirectionSteps}
          directionsParagraph={directionsParagraph}
          setDirectionsParagraph={setDirectionsParagraph}
          originalDirections={originalDirections}
          isEditMode={isEditMode}
          handleStepDelete={handleStepDelete}
        />
        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={(e) => {
            e.stopPropagation();
            setAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          classes={{
            paper: classes.paper,
          }}
          style={{ zIndex: "1303" }}
        >
          <Grid container direction="column">
            <Grid
              item
              style={{
                background: "black",
                borderBottom: "1px solid white",
                padding: "10px",
              }}
            >
              <label className="fileContainer" style={{ fontSize: "16px" }}>
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </Grid>
            <Grid item style={{ background: "black" }}>
              <Button
                className={classes.button}
                style={{
                  fontSize: "16px",
                  width: "100%",
                  fontFamily: "Signika",
                }}
                onClick={(e) => {
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
    </ClickAwayListener>
  );
};

export default RecipeForms;
