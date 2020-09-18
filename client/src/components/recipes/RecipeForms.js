import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PromptModal from '../popups/PromptModal';
import IconsModal from '../popups/IconsModal';
import RecipeNameInput from './RecipeNameInput';
import RecipeImage from './RecipeImage';
import RecipeIngredients from './RecipeIngredients';
import RecipeDirections from './RecipeDirections';
import FileBase from 'react-file-base64';
import { b64toBlob } from '../../utilities/imageConverter';
import { fullWidth } from '../../styles';
import '../../index.css';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white',
    marginTop: '3px'
  }
}));

const directionsAreDifferent = (
  newDirectionsType,
  newDirectionsParagraph,
  newDirectionSteps,
  originalDirections,
  isEditMode
) => {
  if (isEditMode && newDirectionsType !== typeof originalDirections) {
    return true;
  };
  if (newDirectionsType === "string") {
    if (!isEditMode) {
      return !!newDirectionsParagraph.length
    }
    return newDirectionsParagraph.replace(/\s+/g, '') !== originalDirections.replace(/\s+/g, '');
  } else {
    if (newDirectionSteps.length !== originalDirections.length) {
      return true;
    }
    newDirectionSteps.forEach((direction, index) => {
      if (direction !== originalDirections[index]) {
        return true;
      }
    });
  }
  return false;
}

const RecipeForms = ({
  originalName,
  originalImage,
  originalIngredients,
  originalDirections,
  tableRef,
  isEditMode,
  addIngredientMode, toggleAddIngredientMode,
  editIngredientMode, toggleEditIngredientMode,
  setIsSaveEnabled,
  isErrored,
  isNameEmpty, setIsNameEmpty,
  isImageEmpty, setIsImageEmpty,
  isIngredientsEmpty, setIsIngredientsEmpty,
  isDirectionsEmpty, setIsDirectionsEmpty
}) => {
  const classes = useStyles();
  const [isIconsModalVisible, setIconsModalVisible] = useState(false);
  const [isFileTypeModalVisible, setFileTypeModalVisible] = useState(false);
  const [isDeleteIngredientModalVisible, setDeleteIngredientModalVisible] = useState(false);
  const [isDeleteStepModalVisible, setDeleteStepModalVisible] = useState(false);
  const [focusedContainer, setFocusedContainer] = useState(isEditMode ? "image" : null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(originalName);
  const [image, setImage] = useState(originalImage);
  const [directionsParagraph, setDirectionsParagraph] = useState(
    typeof originalDirections === "string" ? originalDirections : "");
  const [directionSteps, setDirectionSteps] = useState(
    typeof originalDirections === "string" ? [] : originalDirections);
  const [focusedStep, setFocusedStep] = useState(null);
  const [directionsType, setDirectionsType] = useState(typeof originalDirections);
  const [ingredients, setIngredients] = useState(originalIngredients.map((ingredient, index) => ({
    ...ingredient, index, isModified: false
  })));
  const [deletedIndex, setDeletedIndex] = useState(0);
  const [addStepMode, setAddStepMode] = useState(false);
  const containersDisabled = addIngredientMode || editIngredientMode;

  const setFocus = container => {
    if (container !== focusedContainer) {
      if (focusedContainer === "directions"
        && directionsType === "object"
        && directionSteps.length
        && !directionSteps[directionSteps.length - 1].length
      ) {
        handleStepDelete(directionSteps.length - 1);
      }
      setFocusedContainer(container);
    }
  }

  const setGlobalDiff = (
    newName = name,
    newImage = image,
    newIngredients = ingredients,
    newDirectionsType = directionsType,
    newDirectionsParagraph = directionsParagraph,
    newDirectionSteps = directionSteps
  ) => {
    const ingredientsDiff = newIngredients.length !== originalIngredients.length
      || newIngredients.filter(i => i.isModified).length;
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
      ingredientsDiff || directionsDiff
    );
    setIsNameEmpty(!newName.length);
    setIsImageEmpty(!newImage);
    setIsIngredientsEmpty(!newIngredients.length);
    setIsDirectionsEmpty(newDirectionsType === "string"
      ? !newDirectionsParagraph.length
      : !newDirectionSteps.length
    );
  }

  const onImageChange = file => {
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      setFileTypeModalVisible(true);
    } else {
      const data = file.base64.toString();
      const newImage = URL.createObjectURL(b64toBlob(data));
      setImage(newImage);
      setAnchorEl(null);
      setGlobalDiff(undefined, newImage);
    }
  }

  const handleIngredientChange = ingredient => {
    let newIngredients = [...ingredients];
    newIngredients[ingredient.index] = ingredient;
    setIngredients(newIngredients);
    setGlobalDiff(undefined, undefined, newIngredients);
  }

  const handleIngredientAdd = ingredient => {
    let newIngredients = [ingredient, ...ingredients.map(i => ({ ...i, index: i.index + 1 }))];
    setIngredients(newIngredients);
    setGlobalDiff(undefined, undefined, newIngredients);
  }

  const handleIngredientDelete = index => {
    setTimeout(() => {
      setDeleteIngredientModalVisible(false);
      const newIngredients = ingredients.reduce((accum, ingredient) => {
        if (ingredient.index !== index) {
          accum.push(ingredient)
        }
        return accum;
      }, []).map((ingredient, index) => ({
        ...ingredient, index
      }));
      setIngredients(newIngredients);
      setGlobalDiff(undefined, undefined, newIngredients);
    }, 1);
  }

  const handleStepDelete = index => {
    setTimeout(() => {
      setDeleteStepModalVisible(false);
      let currentSteps = [ ...directionSteps ];
      currentSteps.splice(index, 1);
      setDirectionSteps(currentSteps);
      setGlobalDiff(undefined, undefined, undefined, undefined, undefined, currentSteps);
    }, 1);
  }

  return (
    <ClickAwayListener
      onClickAway={e => {
        if (!anchorEl &&
          !containersDisabled &&
          !isIconsModalVisible &&
          !isDeleteIngredientModalVisible &&
          !isDeleteStepModalVisible
        ) {
          setFocus(null);
          e.target.click();
        }
      }}
    >
    <div style={fullWidth}>
      <IconsModal
        isVisible={isIconsModalVisible}
        closeModal={() => setTimeout(() => setIconsModalVisible(false), 1)}
        onConfirm={icon => {
          setImage(icon);
          setGlobalDiff(undefined, icon);
          setTimeout(() => setAnchorEl(null), 1);
        }}
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
        closeModal={() => setTimeout(() => setDeleteIngredientModalVisible(false), 1)}
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
        closeModal={() => setTimeout(() => setDeleteStepModalVisible(false), 1)}
        onConfirm={handleStepDelete}
        onConfirmParam={deletedIndex}
        message={isDeleteStepModalVisible
          ? "Are you sure you want to delete Step " + (deletedIndex + 1) + "?"
          : ""
        }
      />
      <RecipeNameInput
        focusedContainer={focusedContainer}
        containersDisabled={containersDisabled}
        originalName={originalName}
        isNameEmpty={isNameEmpty}
        isErrored={isErrored}
        setName={setName}
        setFocus={setFocus}
        setGlobalDiff={setGlobalDiff}
      />
      <RecipeImage
        focusedContainer={focusedContainer}
        containersDisabled={containersDisabled}
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
        containersDisabled={containersDisabled}
        originalIngredients={originalIngredients}
        isIngredientsEmpty={isIngredientsEmpty}
        isErrored={isErrored}
        setFocus={setFocus}
        tableRef={tableRef}
        ingredients={ingredients}
        editIngredientMode={editIngredientMode}
        toggleEditIngredientMode={toggleEditIngredientMode}
        addIngredientMode={addIngredientMode}
        toggleAddIngredientMode={toggleAddIngredientMode}
        handleIngredientChange={handleIngredientChange}
        handleIngredientAdd={handleIngredientAdd}
        setDeletedIndex={setDeletedIndex}
        setDeleteIngredientModalVisible={setDeleteIngredientModalVisible}
      />
      <RecipeDirections
        focusedContainer={focusedContainer}
        containersDisabled={containersDisabled}
        isDirectionsEmpty={isDirectionsEmpty}
        isErrored={isErrored}
        setGlobalDiff={setGlobalDiff}
        setFocusedContainer={setFocusedContainer}
        directionsType={directionsType}
        setDirectionsType={setDirectionsType}
        directionSteps={directionSteps}
        setDirectionSteps={setDirectionSteps}
        directionsParagraph={directionsParagraph}
        setDirectionsParagraph={setDirectionsParagraph}
        originalDirections={originalDirections}
        directionsAreDifferent={directionsAreDifferent}
        isEditMode={isEditMode}
        addStepMode={addStepMode}
        setAddStepMode={setAddStepMode}
        focusedStep={focusedStep}
        setFocusedStep={setFocusedStep}
        handleStepDelete={handleStepDelete}
        setDeletedIndex={setDeletedIndex}
        setDeleteStepModalVisible={setDeleteStepModalVisible}
      />
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
}

export default RecipeForms;