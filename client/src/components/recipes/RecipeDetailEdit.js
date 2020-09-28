import React, { useState } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import RecipeForms from './RecipeForms';
import { TOGGLE_RECIPE_EDIT_MODE, TOGGLE_RECIPE_CREATE_MODE } from '../../actions';
import {
  darkBackgroundStyle, detailStyle, containerStyle,
  buttonStyle, deleteButtonStyle, saveButtonStyle, cancelButtonStyle
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
  return (
    <div style={darkBackgroundStyle}>
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
                    setIsErrored(isNameEmpty || isImageEmpty || isIngredientsEmpty || isDirectionsEmpty);
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
                    props.toggleCreateMode();
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
          id={props.id}
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
        />
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isEditMode: state.detailRecipe.editMode,
    isCreateMode: state.detailRecipe.createMode
  };
};

const mapDispatchToProps = dispatch => ({
  toggleEditMode: () => dispatch({ type: TOGGLE_RECIPE_EDIT_MODE }),
  toggleCreateMode: () => dispatch({ type: TOGGLE_RECIPE_CREATE_MODE })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeDetailEdit);