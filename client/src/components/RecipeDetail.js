import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { isMobile } from 'react-device-detect';
import { TOGGLE_RECIPE_DETAILS } from '../actions';

const RecipeDetail = props => {
  const fabStyle = {
    background: 'none',
    boxShadow: 'none',
    color: 'black',
  };
  const iconStyle = {
    width:'30',
    height:'30'
  };
  const detailedStyle = {
    borderRadius: '0',
    width: isMobile ? '100vw' : '60vw',
    left: isMobile ? '0' : '20vw',
    height: '100vh',
    position: 'fixed',
    overflowY: 'scroll',
    zIndex: '5',
    top: '0'
  };
  return (
    <Card style={detailedStyle}>
      <CardHeader
        title={
          <Typography
            variant="h4"
            style={{
              fontWeight:'bold', fontFamily:'Shadows Into Light'
            }}
          >
            {props.name}
          </Typography>
        }
        style={{background:'white', color:'black'}}
      />
      <CardMedia
        style={{height:"0", paddingTop:"100%", position:'relative'}}
        image={props.image}
        children={[]}
      >
        <div
          style={{
            position:'absolute', top:'0', left:'0',
            width:'100%', height:'30%', verticalAlign:'text-top',
            backgroundImage:'linear-gradient(white, rgba(0,0,0,0))',
            color:'black', fontWeight:'bold'
          }}
        >
          <div style={{width:'10%', float:'right'}}>
            <Fab
              style={{...fabStyle, float:'right'}}
              onClick={() => {
                props.toggleDetailView();
                document.getElementById('root').style.overflowY = 'scroll';
              }}
            >
              <CloseIcon style={iconStyle}/>
            </Fab>
          </div>
          <Fab style={{...fabStyle, float:'left'}}>
            <FavoriteBorderIcon style={iconStyle}/>
          </Fab>
        </div>
        <div style={{padding:'20px 20px 60px 20px'}}>
          <Typography variant="h5">Directions:</Typography>
          <Typography variant="h6">{props.directions}</Typography>
        </div>
      </CardMedia>
    </Card>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDetailView: () => dispatch({ type: TOGGLE_RECIPE_DETAILS })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeDetail);