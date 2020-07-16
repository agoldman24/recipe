import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import RecipeForms from './RecipeForms';
import { TOGGLE_DETAIL_EDIT_MODE } from '../../actions';
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
  constructor() {
    super();
    this.tableRef = createRef();
  }
  render() {
    const buttonsDisabled = this.props.editRowMode || this.props.addRowMode
    return (
      <div style={darkBackgroundStyle}>
        <Card style={{...detailStyle, paddingBottom: isMobile ? '50%' : '20%'}}>
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
                  onClick={this.props.toggleEditMode}
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
            name={this.props.name}
            image={this.props.image}
            ingredients={this.props.ingredients}
            directions={this.props.directions}
            tableRef={this.tableRef}
          />
        </Card>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    editRowMode: state.detailRecipe.ingredients.editRowMode,
    addRowMode: state.detailRecipe.ingredients.addRowMode
  };
};

const mapDispatchToProps = dispatch => ({
  toggleEditMode: () => dispatch({ type: TOGGLE_DETAIL_EDIT_MODE }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeDetailEdit);