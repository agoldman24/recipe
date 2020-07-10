import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IngredientsTable from '../tables/IngredientsTable';
import { TOGGLE_RECIPE_DETAILS, LOAD_RECIPE_DETAILS_FINISHED } from '../../actions';
import {
  fabStyle, blackIconStyle, darkBackgroundStyle,
  detailStyle, titleStyle, sectionStyle
} from '../../styles';

class RecipeDetail extends React.Component {
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
            <Typography style={{...titleStyle, paddingBottom:'5px'}} variant="h3">Ingredients</Typography>
            <IngredientsTable ingredients={this.props.ingredients} isEditable={!!this.props.activeUser}/>
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
    activeUser: state.activeUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDetailView: () => dispatch({ type: TOGGLE_RECIPE_DETAILS }),
    loadRecipeDetailsFinished: () => dispatch({ type: LOAD_RECIPE_DETAILS_FINISHED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeDetail);