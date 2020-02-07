import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import InfoIcon from '@material-ui/icons/Info';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
 import { FETCH_RECIPE_REQUESTED } from '../actions';
import { isMobile } from 'react-device-detect';

class RecipeCard extends React.Component {
  componentDidMount() {
    if (!this.props.activeRecipe.id) {
      this.props.getRandomRecipe();
    }
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const fabStyle = {
      background: 'none',
      boxShadow: 'none',
      color: 'black',
    };
    return (
      <Card
        style={{
          width: isMobile ? '100vw' : '43vw',
          borderRadius: '0',
          background: '#202020',
          boxShadow: 'none'
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h4"
              style={{
                fontWeight:'bold', fontFamily:'Shadows Into Light'
              }}
            >
              {this.props.activeRecipe.name}
            </Typography>
          }
          style={{background:'white', color:'black'}}
        />
        <CardMedia
          style={{height:"0", paddingTop:"100%", position:'relative'}}
          image={this.props.activeRecipe.image}
          children={[]}
        >
          <div
            style={{
              position:'absolute',top:'0', left:'0',
              width:'100%', height:'30%', verticalAlign:'text-top',
              backgroundImage:'linear-gradient(white, rgba(0,0,0,0))',
              color:'black', fontWeight:'bold'
            }}
          >
            <div style={{width:'10%', float:'right'}}>
              <Fab style={{...fabStyle, float:'right'}}>
                <InfoIcon style={{height:'30', width:'30'}}/>
              </Fab>
            </div>
            <Fab style={{...fabStyle, float:'left'}}>
              <FavoriteBorderIcon style={{height:'30', width:'30'}}/>
            </Fab>
          </div>
          <div
            style={{
              position:'absolute',top:'30%', left:'0',
              width:'100%', verticalAlign:'text-top'
            }}
          >
            <Fab style={{...fabStyle, color:'white', float:'left'}}>
              <ArrowBackIosIcon style={{height:'30', width:'30'}}/>
            </Fab>
            <Fab
              style={{...fabStyle, color:'white', float:'right'}}
              onClick={this.props.getRandomRecipe}
            >
              <ArrowForwardIosIcon style={{height:'30', width:'30'}}/>
            </Fab>
          </div>
          <div style={{
            position:'absolute',
            bottom:'0',
            width:'100%',
            height:'50px',
            backgroundImage:'linear-gradient(rgba(0,0,0,0), #202020)',
          }}/>
        </CardMedia>
      </Card>
    );
  }
};

const mapStateToProps = state => {
  return {
    activeRecipe: state.activeRecipe
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeCard);