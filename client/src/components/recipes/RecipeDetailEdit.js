import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import RecipeForms from './RecipeForms';
import { TOGGLE_RECIPE_EDIT_MODE, CREATE_RECIPE_REQUESTED } from '../../actions';
import { detailStyle } from '../../styles';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
    background: '#292929'
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    fontSize: '20px',
    flex: 1,
  },
  button: {
    color: '#45bbff'
  }
}));

const buttonStyle = {
  paddingLeft: '0',
  paddingRight: '0',
  minWidth: '0'
}

const RecipeDetailEdit = props => {
  const classes = useStyles();
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
  const emptyField = isNameEmpty || isImageEmpty || isIngredientsEmpty || isDirectionsEmpty;
  return (
    <Card style={detailStyle}>
      <AppBar className={classes.appBar}>
        <Toolbar style={{padding:'0'}}>
          <Grid container direction="row" style={{padding:'0 15px'}}>
            <Grid item style={{width:'25%'}}>
              {props.isEditMode
              ? <Button style={buttonStyle} className={classes.button}
                  disabled={!isSaveEnabled} onClick={() => setIsErrored(emptyField)}>
                  Save
                </Button>
              : <Button style={buttonStyle} className={classes.button} onClick={() => {
                  if (emptyField) {
                    setIsErrored(true);
                  } else if (!props.isSpinnerVisible) {
                    const directions = directionsType === "string"
                      ? directionsParagraph
                      : directionSteps;
                    props.onClose();
                    props.createRecipe(name, image, ingredients, directions);
                  }
                }}>
                  Submit
                </Button>
              }
            </Grid>
            <Grid item style={{margin:'auto', width:'50%'}}>
              <Typography className={classes.title}>
                {props.isEditMode ? "Edit Recipe" : "Create Recipe"}
              </Typography>
            </Grid>
            <Grid item style={{width:'25%'}}>
              <Button style={{...buttonStyle, float:'right'}} onClick={() => {
                if (props.isEditMode) {
                  props.toggleEditMode();
                } else {
                  props.onClose();
                }
              }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
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