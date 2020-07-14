import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import IngredientsTable from '../tables/IngredientsTable';
import {
  TOGGLE_DETAIL_EDIT_MODE,
  TOGGLE_INGREDIENTS_EDIT_ROW_MODE,
  TOGGLE_INGREDIENTS_ADD_ROW_MODE,
  TOGGLE_MODAL
} from '../../actions';
import {
  defaultTheme, darkBackgroundStyle, detailStyle, radioLabelStyle,
  buttonStyle, deleteButtonStyle, saveButtonStyle, cancelButtonStyle
} from '../../styles';
import { isMobile } from 'react-device-detect';

const styles = () => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white'
  },
  inputText: {
    fontSize: '16px',
    lineHeight: '1.5'
  },
  multilineTextField: {
    padding: '10px 5px 10px 15px'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const rightSideActionStyle = {
  float: 'right',
  width: isMobile ? '40%' : '30%',
  margin: '10px 10px 0 0'
}

const addButtonStyle = {
  ...buttonStyle,
  ...rightSideActionStyle,
  color: '#45bbff',
  border: '2px solid #45bbff'
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
  color: defaultTheme.palette.primary.main,
  fontSize: '20px'
}

class RecipeDetailEdit extends React.Component {
  constructor() {
    super();
    this.tableRef = createRef();
    this.state = {
      focusedContainer: null,
      directions: {
        type: "",
        value: ""
      }
    }
  }
  componentDidMount() {
    this.setState({
      directions: {
        type: typeof this.props.directions === "string"
          ? "paragraph"
          : "step-by-step",
        value: this.props.directions
      }
    });
  }
  render() {
    return (
      <div style={darkBackgroundStyle} onClick={() => this.setState({ focusedContainer: null })}>
        <Card style={{...detailStyle, paddingBottom: isMobile ? '50%' : '20%'}}>
          <Grid
            container
            direction="column"
            style={{
              ...containerStyle,
              border:'none',
              margin:'0',
              width:'inherit'
            }}
          >
            <Grid item style={{...itemStyle, height:'45px', width:'inherit'}}>
              <div style={{display:'flex', position:'fixed', zIndex:'99', paddingLeft:'2px'}}>
                <Button style={fixedDeleteButtonStyle}>Delete</Button>
                <Button startIcon={<SaveIcon/>} style={fixedSaveButtonStyle}>Save</Button>
                <Button style={fixedCancelButtonStyle} onClick={() => {
                  if (this.props.addRowMode || this.props.editRowMode) {
                    alert('You have unsaved changes!')
                  } else {
                    this.props.toggleEditMode();
                  }
                }}>Cancel</Button>
              </div>
              <div style={{
                zIndex:'98',
                width:'inherit',
                height:'50px',
                position:'fixed',
                background:'#292929',
                borderBottom:'1px solid #a3a3a3'
              }}/>
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            style={{
              ...containerStyle,
              border: this.state.focusedContainer === "ingredients" ? '1px solid #ffe100' : '1px solid white'
            }}
            onClick={event => {
              event.stopPropagation();
              event.cancelBubble = true;
              this.setState({ focusedContainer: "ingredients" });
            }}
          >
            <Grid item style={itemStyle}>
              <Typography style={sectionTitleStyle}>Ingredients*</Typography>
              <Button
                startIcon={<AddIcon/>}
                style={{...addButtonStyle, opacity: this.props.editRowMode ? '0.3' : '1.0'}}
                disabled={this.props.editRowMode}
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
                editMode={this.props.editMode}
                editRowMode={this.props.editRowMode}
                addRowMode={this.props.addRowMode}
                toggleEditRowMode={this.props.toggleEditRowMode}
                toggleAddRowMode={this.props.toggleAddRowMode}
                toggleModal={this.props.toggleModal}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            style={{
              ...containerStyle,
              border: this.state.focusedContainer === "directions" ? '1px solid #ffe100' : '1px solid white'
            }}
            onClick={event => {
              event.stopPropagation();
              event.cancelBubble = true;
              this.setState({ focusedContainer: "directions" });
            }}
          >
            <Grid item style={itemStyle}>
              <Typography style={sectionTitleStyle}>Directions*</Typography>
              <FormControl component="fieldset" style={rightSideActionStyle}>
                <RadioGroup
                  value={this.state.directions.type}
                  onChange={e => this.setState({
                    directions: {
                      ...this.state.directions,
                      type: e.target.value
                    }
                  })}
                >
                  <FormControlLabel
                    value="step-by-step"
                    control={<Radio color="primary" />}
                    label="Step-by-Step"
                    style={radioLabelStyle(this.state, "step-by-step")}
                  />
                  <FormControlLabel
                    value="paragraph"
                    control={<Radio color="primary" />}
                    label="Paragraph"
                    style={radioLabelStyle(this.state, "paragraph")}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item style={itemStyle}>
              {this.state.directions.type === "paragraph"
                ? <TextField
                    InputProps={{
                      classes: {
                        root: this.props.classes.multilineTextField,
                        input: this.props.classes.inputText
                      }
                    }}
                    style={{width:'95%', margin:'10px 2.5%'}}
                    variant="outlined"
                    multiline
                    rowsMax={8}
                    value={this.state.directions.value}
                    onChange={e => this.setState({
                      directions: {
                        ...this.state.directions,
                        value: e.target.value
                      }
                    })}
                  />
                : null
              }
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    editMode: state.detailRecipe.editMode,
    editRowMode: state.detailRecipe.ingredients.editRowMode,
    addRowMode: state.detailRecipe.ingredients.addRowMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleEditMode: () => dispatch({ type: TOGGLE_DETAIL_EDIT_MODE }),
    toggleEditRowMode: () => dispatch({ type: TOGGLE_INGREDIENTS_EDIT_ROW_MODE }),
    toggleAddRowMode: () => dispatch({ type: TOGGLE_INGREDIENTS_ADD_ROW_MODE }),
    toggleModal: (actionName, actionPayload) => {
      dispatch({ type: TOGGLE_MODAL, actionName, actionPayload })
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecipeDetailEdit));