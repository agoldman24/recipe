import React, { createRef } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IngredientsTable from '../tables/IngredientsTable';
import {
  TOGGLE_RECIPE_DETAILS,
  LOAD_RECIPE_DETAILS_FINISHED,
  TOGGLE_ADD_ROW_MODE
} from '../../actions';
import {
  fabStyle, blackIconStyle, darkBackgroundStyle,
  detailStyle, titleStyle, sectionStyle, buttonStyle
} from '../../styles';

const actionButtonStyle = {
  ...buttonStyle,
  float:'right',
  height:'40%',
  width:'30%',
  margin:'40px 5% 0 0'
}

class RecipeDetail extends React.Component {
  constructor() {
    super();
    this.tableRef = createRef();
  }
  componentDidMount() {
    this.props.loadRecipeDetailsFinished();
  }
  render() {
    return (
      <div style={darkBackgroundStyle}>
        <Card style={detailStyle}>
          <CardHeader
            title={
              <Typography
                variant="h3"
                style={{
                  fontWeight:'bold', fontFamily:'Shadows Into Light'
                }}
              >
                {this.props.name}
              </Typography>
            }
            style={{background:'white', color:'black'}}
          />
          <CardMedia
            style={{height:"0", paddingTop:"100%", position:'relative'}}
            image={this.props.image}
            children={[]}
          >
            <div
              style={{
                position:'absolute', top:'0', left:'0', zIndex: '99',
                width:'100%', height:'30%', verticalAlign:'text-top',
                backgroundImage:'linear-gradient(white, rgba(0,0,0,0))',
                color:'black', fontWeight:'bold'
              }}
            >
              <div style={{width:'10%', float:'right'}}>
                <Fab
                  style={{...fabStyle, float:'right'}}
                  onClick={() => {
                    this.props.toggleDetailView();
                    document.getElementById('root').style.overflowY = 'auto';
                  }}
                >
                  <CloseRoundedIcon style={blackIconStyle} />
                </Fab>
              </div>
            </div>
            <div style={{width:'100%', display:'flex'}}>
              <Typography style={{...titleStyle, paddingBottom:'5px'}} variant="h3">Ingredients</Typography>
              <div style={{width:'50%'}}>
                <Button
                  startIcon={<SaveIcon/>}
                  style={{
                    ...actionButtonStyle,
                    border: '1px solid rgba(255, 255, 255, 0.3)' // todo: replace with disabled logic
                  }}
                  disabled={true}
                >
                  Save
                </Button>
                <Button
                  startIcon={<AddIcon/>}
                  style={actionButtonStyle}
                  onClick={() => this.props.toggleAddRowMode()}
                >
                  Add
                </Button>
              </div>
            </div>
            <IngredientsTable
              tableRef={this.tableRef}
              ingredients={this.props.ingredients}
              isEditable={!!this.props.activeUser}
              addRowMode={this.props.addRowMode}
            />
            <Typography style={titleStyle} variant="h3">Directions</Typography>
            <Typography style={sectionStyle}>{this.props.directions}</Typography>
          </CardMedia>
        </Card>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser,
    addRowMode: state.addRowMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDetailView: () => dispatch({ type: TOGGLE_RECIPE_DETAILS }),
    loadRecipeDetailsFinished: () => dispatch({ type: LOAD_RECIPE_DETAILS_FINISHED }),
    toggleAddRowMode: () => dispatch({ type: TOGGLE_ADD_ROW_MODE })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeDetail);