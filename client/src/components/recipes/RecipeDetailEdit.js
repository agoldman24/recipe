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
    isSaveEnabled: false,
    isErrored: false,
    isNameEmpty: this.props.isCreateMode,
    isImageEmpty: this.props.isCreateMode,
    isIngredientsEmpty: this.props.isCreateMode,
    isDirectionsEmpty: this.props.isCreateMode
  }
  render() {
    const { addIngredientMode, editIngredientMode, isSaveEnabled } = this.state;
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
                {this.props.isEditMode
                ? <div>
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
                        opacity: buttonsDisabled || !isSaveEnabled ? '0.3' : '1.0'
                      }}
                      disabled={buttonsDisabled || !isSaveEnabled}
                      onClick={() => {
                        const { isNameEmpty, isImageEmpty, isIngredientsEmpty, isDirectionsEmpty } = this.state;
                        if (isNameEmpty || isImageEmpty || isIngredientsEmpty || isDirectionsEmpty) {
                          this.setState({ isErrored: true });
                        } else {
                          this.setState({ isErrored: false });
                        }
                      }}
                    >
                      Save
                    </Button>
                  </div>
                : <Button
                    style={{
                      ...fixedSaveButtonStyle,
                      opacity: buttonsDisabled ? '0.3' : '1.0'
                    }}
                    disabled={buttonsDisabled}
                    onClick={() => {
                      const { isNameEmpty, isImageEmpty, isIngredientsEmpty, isDirectionsEmpty } = this.state;
                      if (isNameEmpty || isImageEmpty || isIngredientsEmpty || isDirectionsEmpty) {
                        this.setState({ isErrored: true });
                      } else {
                        this.setState({ isErrored: false });
                      }
                    }}
                  >
                    Submit
                  </Button>
                }
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
            setIsSaveEnabled={val => this.setState({ isSaveEnabled: val })}
            isErrored={this.state.isErrored}
            isNameEmpty={this.state.isNameEmpty}
            isImageEmpty={this.state.isImageEmpty}
            isIngredientsEmpty={this.state.isIngredientsEmpty}
            isDirectionsEmpty={this.state.isDirectionsEmpty}
            setIsNameEmpty={val => this.setState({ isNameEmpty: val })}
            setIsImageEmpty={val => this.setState({ isImageEmpty: val })}
            setIsIngredientsEmpty={val => this.setState({ isIngredientsEmpty: val })}
            setIsDirectionsEmpty={val => this.setState({ isDirectionsEmpty: val })}
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