import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PromptModal from '../popups/PromptModal';
import IconsModal from '../popups/IconsModal';
import RecipeNameField from './RecipeNameField';
import RecipeImage from './RecipeImage';
import RecipeIngredients from './RecipeIngredients';
import RecipeDirections from './RecipeDirections';
import FileBase from 'react-file-base64';
import { b64toBlob } from '../../utilities/imageConverter';
import { fullWidth } from '../../styles';
import { directionsAreDifferent, ingredientsAreDifferent } from './utils';
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
  originalDirections,
  isEditMode,
  setIsSaveEnabled,
  isErrored,
  isNameEmpty, setIsNameEmpty,
  isImageEmpty, setIsImageEmpty,
  isIngredientsEmpty, setIsIngredientsEmpty,
  isDirectionsEmpty, setIsDirectionsEmpty,
  name, setName,
  image, setImage,
  ingredients, setIngredients,
  directionsType, setDirectionsType,
  directionsParagraph, setDirectionsParagraph,
  directionSteps, setDirectionSteps
}) => {
  const classes = useStyles();
  const [isIconsModalVisible, setIconsModalVisible] = useState(false);
  const [isFileTypeModalVisible, setFileTypeModalVisible] = useState(false);
  const [focusedContainer, setFocusedContainer] = useState(isEditMode ? "image" : null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElChanged, setAnchorElChanged] = useState(false);
  const prevAnchorEl = usePrevious(anchorEl);
  useEffect(() => setAnchorElChanged(prevAnchorEl !== anchorEl));

  const setFocus = container => {
    if (container !== focusedContainer) {
      if (focusedContainer === "directions"
        && directionsType === "object"
        && directionSteps.length
        && !directionSteps[directionSteps.length - 1].length
      ) {
        handleStepDelete(directionSteps.length - 1);
      }
      else if (focusedContainer === "ingredients"
        && ingredients.length
        && !ingredients[ingredients.length - 1].item.length
      ) {
        handleIngredientDelete(ingredients.length - 1);
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

  const handleIngredientDelete = index => {
    let currentIngredients = [...ingredients];
    currentIngredients.splice(index, 1);
    setIngredients(currentIngredients);
    setGlobalDiff(undefined, undefined, currentIngredients);
  }

  const handleStepDelete = index => {
    let currentSteps = [...directionSteps];
    currentSteps.splice(index, 1);
    setDirectionSteps(currentSteps);
    setGlobalDiff(undefined, undefined, undefined, undefined, undefined, currentSteps);
  }

  return (
    <ClickAwayListener
      onClickAway={e => {
        if (!anchorElChanged &&
          !isIconsModalVisible &&
          !isFileTypeModalVisible
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
        closeModal={() => setTimeout(() => setFileTypeModalVisible(false), 1)}
        message={"Invalid file type. Please choose a PNG or JPEG file."}
      />
      <RecipeNameField
        focusedContainer={focusedContainer}
        originalName={originalName}
        isNameEmpty={isNameEmpty}
        isErrored={isErrored}
        setName={setName}
        setFocus={setFocus}
        setGlobalDiff={setGlobalDiff}
      />
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
        onClose={e => {
          e.stopPropagation();
          setAnchorEl(null)
        }}
        anchorOrigin={{
          vertical: 'center',
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
    </ClickAwayListener>
  );
}

export default RecipeForms;