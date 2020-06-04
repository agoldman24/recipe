import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import InfoIcon from '@material-ui/icons/Info';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { isMobile } from 'react-device-detect';
import { TOGGLE_RECIPE_DETAILS, UPDATE_USER_REQUESTED } from '../../actions';
import { SAVED_RECIPE_IDS } from '../../variables/Constants';

const RecipeCard = props => {
  const fabStyle = {
    background: 'none',
    boxShadow: 'none',
    color: 'black'
  };
  const iconStyle = {
    width:'30',
    height:'30'
  };
  const undetailedStyle = {
    borderRadius: '0',
    background: '#202020',
    boxShadow: 'none',
    width: isMobile ? '100vw' : '30vw'
  };
  return (
    <Card style={undetailedStyle}>
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
                props.toggleDetailView(props.id);
                document.getElementById('root').style.overflowY = 'hidden';
              }}
            >
              <InfoIcon style={iconStyle}/>
            </Fab>
          </div>
          {props.isLoggedIn
          ? props.savedRecipeIds.includes(props.id)
            ? <Fab
                onClick={() => props.updateSavedRecipes(
                  props.activeUser.id, props.id, false
                )}
                style={{...fabStyle, float:'left'}}
              >
                <FavoriteIcon style={iconStyle}/>
              </Fab>
            : <Fab
                onClick={() => props.updateSavedRecipes(
                  props.activeUser.id, props.id, true
                )}
                style={{...fabStyle, float:'left'}}
              >
                <FavoriteBorderIcon style={iconStyle}/>
              </Fab>
          : null
          }
        </div>
        <div
          style={{
            position:'absolute', top:'30%', left:'0',
            width:'100%', verticalAlign:'text-top'
          }}
        >
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
};

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    savedRecipeIds: !!state.activeUser
      ? state.activeUser.savedRecipeIds.map(obj => obj.id)
      : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDetailView: id => dispatch({ type: TOGGLE_RECIPE_DETAILS, id }),
    updateSavedRecipes: (id, recipeId, keep) => dispatch({
      type: UPDATE_USER_REQUESTED,
      updateType: SAVED_RECIPE_IDS,
      id, recipeId, keep
    })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeCard);