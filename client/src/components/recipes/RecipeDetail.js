import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IngredientsTable from '../tables/IngredientsTable';
import { isMobile } from 'react-device-detect';
import { TOGGLE_RECIPE_DETAILS } from '../../actions';

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
  const darkBackgroundStyle = {
    position:'fixed',
    top:'0',
    left:'0',
    height:'100vh',
    width:'100vw',
    zIndex:'4',
    background:'rgba(0,0,0,0.7)'
  }
  const detailStyle = {
    borderRadius: '0',
    width: isMobile ? '100vw' : '60vw',
    left: isMobile ? '0' : '20vw',
    height: '100vh',
    position: 'fixed',
    overflowY: 'auto',
    zIndex: '5',
    top: '0'
  };
  const titleStyle = {
    padding: '20px',
    fontFamily: 'Shadows Into Light',
  }
  const sectionStyle = {
    marginLeft: '5%',
    width: '90%',
    fontSize: '16px',
    paddingBottom: '50%',
    lineHeight: '2'
  }
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
                  document.getElementById('root').style.overflowY = 'auto';
                }}
              >
                <CloseRoundedIcon
                  style={{
                    ...iconStyle,
                    position:'fixed',
                    background:'black',
                    color:'white',
                    borderRadius:'50px'
                  }}
                />
              </Fab>
            </div>
          </div>
          <Typography style={titleStyle} variant="h3">Ingredients</Typography>
          <IngredientsTable ingredients={props.ingredients}/>
          <Typography style={titleStyle} variant="h3">Directions</Typography>
          <Typography style={sectionStyle}>{props.directions}</Typography>
        </CardMedia>
      </Card>
    </div>
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