import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import IngredientsTable from '../tables/IngredientsTable';
import {
  TOGGLE_DETAIL_EDIT_MODE,
  TOGGLE_DETAIL_ADD_ROW_MODE
} from '../../actions';
import {
  darkBackgroundStyle, whiteFadeBackgroundStyle,
  detailStyle, sectionStyle, buttonStyle
} from '../../styles';

const styles = () => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white'
  }
});

const addButtonStyle = {
  ...buttonStyle,
  color: '#45bbff',
  border: '2px solid #45bbff',
  float:'right',
  width: '20%',
  margin: '10px 10px 0 0'
}

const fixedButtonStyle = {
  ...buttonStyle,
  width: '12vw',
  background: '#292929',
  margin: '0 0 10px 10px'
}

const deleteButtonStyle = {
  ...fixedButtonStyle,
  color: '#ff4621',
  border: '2px solid #ff4621'
}

const saveButtonStyle = {
  ...fixedButtonStyle,
  color: '#df52ff',
  border: '2px solid #df52ff'
}

const cancelButtonStyle = {
  ...fixedButtonStyle,
  color: '#cccccc',
  border: '2px solid #cccccc'
}

const containerStyle = {
  display: 'flex',
  border: '1px solid white',
  borderRadius: '5px',
  margin: '10px',
  width: 'initial'
}

const itemStyle = {
  width: '100%'
}

const sectionTitleStyle = {
  float: 'left',
  margin: '10px 0 0 15px',
  color: 'yellow',
  fontSize: '20px'
}

class RecipeDetailEdit extends React.Component {
  constructor() {
    super();
    this.tableRef = createRef();
  }
  render() {
    return (
      <div style={darkBackgroundStyle}>
        <Card style={detailStyle}>
          <Grid container direction="column" style={{...containerStyle, border: 'none'}}>
            <Grid item style={{...itemStyle, height:'30px'}}>
              <div style={{display:'flex', position:'fixed', zIndex:'99'}}>
                <Button
                  style={deleteButtonStyle}
                  className={this.props.classes.button}
                >
                  Delete
                </Button>
                <Button
                  startIcon={<SaveIcon/>}
                  style={saveButtonStyle}
                  className={this.props.classes.button}
                >
                  Save
                </Button>
                <Button
                  style={cancelButtonStyle}
                  className={this.props.classes.button}
                  onClick={() => {
                    if (this.props.addRowMode ||
                      (this.tableRef.current && this.tableRef.current.state.lastEditingRow)
                    ) {
                      alert('You have unsaved changes!');
                    } else {
                      this.props.toggleEditMode();
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
          <Grid container direction="column" style={containerStyle}>
            <Grid item style={itemStyle}>
              <Typography style={sectionTitleStyle}>Ingredients*</Typography>
              <Button
                startIcon={<AddIcon/>}
                style={addButtonStyle}
                onClick={this.props.toggleAddRowMode}
                className={this.props.classes.button}
              >
                Add
              </Button>
            </Grid>
            <Grid item style={itemStyle}>
              <IngredientsTable
                tableRef={this.tableRef}
                ingredients={this.props.ingredients}
                isEditable={true}
                addRowMode={this.props.addRowMode}
                toggleAddRowMode={this.props.toggleAddRowMode}
              />
            </Grid>
          </Grid>
          <Typography style={sectionStyle}>{this.props.directions}</Typography>
        </Card>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    addRowMode: state.detailRecipe.addRowMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleEditMode: () => dispatch({ type: TOGGLE_DETAIL_EDIT_MODE }),
    toggleAddRowMode: () => dispatch({ type: TOGGLE_DETAIL_ADD_ROW_MODE })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecipeDetailEdit));