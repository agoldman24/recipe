import React, { useState } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import RecipeForms from './RecipeForms';
import { TOGGLE_RECIPE_EDIT_MODE, CREATE_RECIPE_REQUESTED } from '../../actions';
import {
  detailStyle, containerStyle, buttonStyle,
  deleteButtonStyle, saveButtonStyle, cancelButtonStyle
} from '../../styles';

const fixedContainerStyle = {
  ...containerStyle,
  border: 'none',
  margin: '0',
  width: 'inherit'
}

const fixedButtonStyle = {
  ...buttonStyle,
  width: '100px',
  margin: '10px 0 10px 10px'
}

const fixedDeleteButtonStyle = {
  ...fixedButtonStyle,
  ...deleteButtonStyle
}

const fixedSaveButtonStyle = {
  ...fixedButtonStyle,
  ...saveButtonStyle
}

const fixedCancelButtonStyle = {
  ...fixedButtonStyle,
  ...cancelButtonStyle
}

const RecipeDetailEdit = props => {
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(props.isCreateMode);
  const [isImageEmpty, setIsImageEmpty] = useState(props.isCreateMode);
  const [isIngredientsEmpty, setIsIngredientsEmpty] = useState(props.isCreateMode);
  const [isDirectionsEmpty, setIsDirectionsEmpty] = useState(props.isCreateMode);
  const [name, setName] = useState(props.name);
  const [image, setImage] = useState(props.image);
  const [ingredients, setIngredients] = useState(props.ingredients);
  const [directionsType, setDirectionsType] = useState(typeof props.directions);
  const [directionsParagraph, setDirectionsParagraph] = useState(
    directionsType === "string" ? props.directions : "");
  const [directionSteps, setDirectionSteps] = useState(
    directionsType === "string" ? [] : props.directions);
  return (
    <Card style={detailStyle}>
      <Grid
        container
        direction="column"
        style={fixedContainerStyle}
      >
        <Grid item style={{
          height: '45px',
          width:'inherit'
        }}>
          <div style={{
            display: 'flex',
            position: 'fixed',
            zIndex: '99',
            paddingLeft: '2px'
          }}>
            {props.isEditMode
            ? <div>
                <Button style={fixedDeleteButtonStyle}>
                  Delete
                </Button>
                <Button
                  startIcon={<SaveIcon/>}
                  style={{
                    ...fixedSaveButtonStyle,
                    opacity: !isSaveEnabled ? '0.3' : '1.0'
                  }}
                  disabled={!isSaveEnabled}
                  onClick={() => {
                    setIsErrored(isNameEmpty || isImageEmpty || isIngredientsEmpty || isDirectionsEmpty);
                  }}
                >
                  Save
                </Button>
              </div>
            : <Button
                style={fixedSaveButtonStyle}
                onClick={() => {
                  const empty = isNameEmpty || isImageEmpty || isIngredientsEmpty || isDirectionsEmpty;
                  if (empty) {
                    setIsErrored(true);
                  } else if (!props.isSpinnerVisible) {
                    const directions = directionsType === "string"
                      ? directionsParagraph
                      : directionSteps;
                    props.onClose();
                    props.createRecipe(name, image, ingredients, directions);
                  }
                }}
              >
                Submit
              </Button>
            }
            <Button
              style={fixedCancelButtonStyle}
              onClick={() => {
                if (props.isEditMode) {
                  props.toggleEditMode();
                } else {
                  props.onClose();
                }
              }}
            >
              Cancel
            </Button>
          </div>
          <div style={{
            zIndex: '98',
            width: 'inherit',
            height: '50px',
            position: 'fixed',
            background: '#292929',
            borderBottom: '1px solid #a3a3a3'
          }}/>
        </Grid>
      </Grid>
      <RecipeForms
        originalName={props.name}
        originalImage={props.image}
        originalIngredients={props.ingredients}
        originalDirections={props.directions}
        isEditMode={props.isEditMode}
        setIsSaveEnabled={setIsSaveEnabled}
        isErrored={isErrored}
        isNameEmpty={isNameEmpty}
        isImageEmpty={isImageEmpty}
        isIngredientsEmpty={isIngredientsEmpty}
        isDirectionsEmpty={isDirectionsEmpty}
        setIsNameEmpty={setIsNameEmpty}
        setIsImageEmpty={setIsImageEmpty}
        setIsIngredientsEmpty={setIsIngredientsEmpty}
        setIsDirectionsEmpty={setIsDirectionsEmpty}
        name={name}
        image={image}
        ingredients={ingredients}
        directionsType={directionsType}
        directionsParagraph={directionsParagraph}
        directionSteps={directionSteps}
        setName={setName}
        setImage={setImage}
        setIngredients={setIngredients}
        setDirectionsType={setDirectionsType}
        setDirectionsParagraph={setDirectionsParagraph}
        setDirectionSteps={setDirectionSteps}
      />
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    isEditMode: state.recipeEditMode,
    isSpinnerVisible: state.isSpinnerVisible
  };
};

const mapDispatchToProps = dispatch => ({
  toggleEditMode: () => dispatch({ type: TOGGLE_RECIPE_EDIT_MODE }),
  createRecipe: (name, image, ingredients, directions) => dispatch({
    type: CREATE_RECIPE_REQUESTED,
    name, image, ingredients, directions
  })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeDetailEdit);