import React, { createRef } from 'react';
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

class RecipeDetailEdit extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = createRef();
  }
  state = {
    addIngredientMode: false,
    editIngredientMode: false,
    isIconsModalVisible: false,
    isFileTypeModalVisible: false,
    isDeleteIngredientModalVisible: false,
    isDeleteStepModalVisible: false,
    isNameFocused: false,
    focusedContainer: this.props.isEditMode ? "image" : null,
    anchorEl: null,
    name: this.props.name,
    image: this.props.image,
    directionsParagraph: typeof this.props.directions === "string" ? this.props.directions : "",
    directionSteps: typeof this.props.directions === "string" ? [] : this.props.directions,
    focusedStep: null,
    directionsType: typeof this.props.directions,
    ingredients: this.props.ingredients.map((ingredient, index) => ({
      ...ingredient, index, isModified: false
    })),
    deletedIndex: 0,
    addStepMode: false
  }
  render() {
    const { addIngredientMode, editIngredientMode } = this.state;
    const buttonsDisabled = addIngredientMode || editIngredientMode;
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
                <Button
                  style={{
                    ...fixedDeleteButtonStyle,
                    opacity: buttonsDisabled ? '0.3' : '1.0'
                  }}
                  disabled={buttonsDisabled}
                >
                  Delete
                </Button>
                <Button
                  startIcon={<SaveIcon/>}
                  style={{
                    ...fixedSaveButtonStyle,
                    opacity: buttonsDisabled ? '0.3' : '1.0'
                  }}
                  disabled={buttonsDisabled}
                >
                  Save
                </Button>
                <Button
                  style={{
                    ...fixedCancelButtonStyle,
                    opacity: buttonsDisabled ? '0.3' : '1.0'
                  }}
                  disabled={buttonsDisabled}
                  onClick={() => {
                    if (this.props.isEditMode) {
                      this.props.toggleEditMode();
                    } else {
                      this.props.toggleCreateMode();
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
            id={this.props.id}
            originalName={this.props.name}
            originalImage={this.props.image}
            originalIngredients={this.props.ingredients}
            originalDirections={this.props.directions}
            tableRef={this.tableRef}
            isEditMode={this.props.isEditMode}
            addIngredientMode={this.state.addIngredientMode}
            editIngredientMode={this.state.editIngredientMode}
            toggleAddIngredientMode={() => this.setState({ addIngredientMode: !this.state.addIngredientMode })}
            toggleEditIngredientMode={() => this.setState({ editIngredientMode: !this.state.editIngredientMode })}
            isIconsModalVisible={this.state.isIconsModalVisible}
            setIconsModalVisible={val => this.setState({ isIconsModalVisible: val })}
            isFileTypeModalVisible={this.state.isFileTypeModalVisible}
            setFileTypeVisible={val => this.setState({ isFileTypeModalVisible: val })}
            isDeleteIngredientModalVisible={this.state.isDeleteIngredientModalVisible}
            setDeleteIngredientModalVisible={val => this.setState({ isDeleteIngredientModalVisible: val })}
            isDeleteStepModalVisible={this.state.isDeleteStepModalVisible}
            setDeleteStepModalVisible={val => this.setState({ isDeleteStepModalVisible: val })}
            isNameFocused={this.state.isNameFocused}
            setIsNameFocused={val => this.setState({ isNameFocused: val })}
            focusedContainer={this.state.focusedContainer}
            setFocusedContainer={val => this.setState({ focusedContainer: val })}
            anchorEl={this.state.anchorEl}
            setAnchorEl={val => this.setState({ anchorEl: val })}
            name={this.state.name}
            setName={val => this.setState({ name: val })}
            image={this.state.image}
            setImage={val => this.setState({ image: val })}
            directionsParagraph={this.state.directionsParagraph}
            setDirectionsParagraph={val => this.setState({ directionsParagraph: val })}
            directionSteps={this.state.directionSteps}
            setDirectionSteps={val => this.setState({ directionSteps: val })}
            focusedStep={this.state.focusedStep}
            setFocusedStep={val => this.setState({ focusedStep: val })}
            directionsType={this.state.directionsType}
            setDirectionsType={val => this.setState({ directionsType: val })}
            ingredients={this.state.ingredients}
            setIngredients={val => this.setState({ ingredients: val })}
            deletedIndex={this.state.deletedIndex}
            setDeletedIndex={val => this.setState({ deletedIndex: val })}
            addStepMode={this.state.addStepMode}
            setAddStepMode={val => this.setState({ addStepMode: val })}
          />
        </Card>
      </div>
    );
  }
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