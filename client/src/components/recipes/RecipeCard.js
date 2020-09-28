import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LOAD_RECIPE_DETAILS_START, TOGGLE_RECIPE_DETAILS, UPDATE_USER_REQUESTED } from '../../actions';
import { LIKED_RECIPE_IDS } from '../../variables/Constants';
import { fabStyle, iconStyle, headerStyle, undetailedStyle, whiteFadeBackgroundStyle } from '../../styles';
import '../../index.css';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '-10px'
  }
}));

const RecipeCard = props => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const openRecipeDetails = event => {
    props.loadRecipeDetailsStart();
    setTimeout(() => props.toggleDetailView(props.id), 1);
    document.getElementById('root').style.overflowY = 'hidden';
  }
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
        style={headerStyle}
        className="cardHeader"
        onClick={openRecipeDetails}
      />
      <div className="cardMedia" onClick={openRecipeDetails}>
        <div style={{...whiteFadeBackgroundStyle, backgroundImage:'none'}}>
          <CircularProgress style={{
            display: isLoading ? 'block' : 'none',
            margin: 'auto',
            marginTop: '40%',
            width: '25%',
            height: 'auto'
          }}/>
          <img alt="icon" width="100%" src={props.image}
            onLoad={() => {
              setIsLoading(false);
            }}
            style={{
              display: isLoading ? 'none' : 'block'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100px',
            backgroundImage: 'linear-gradient(white, rgba(0, 0, 0, 0))'
          }}>
          {props.isLoggedIn
          ? props.likedRecipeIds.includes(props.id)
            ? <Fab
                onClick={event => {
                  event.stopPropagation();
                  props.updateLikedRecipes(props.activeUser.id, props.id, false)
                }}
                style={{...fabStyle, float:'left'}}
                classes={{ root: classes.root }}
              >
                <FavoriteIcon style={iconStyle}/>
              </Fab>
            : <Fab
                onClick={event => {
                  event.stopPropagation();
                  props.updateLikedRecipes(props.activeUser.id, props.id, true)
                }}
                style={{...fabStyle, float:'left'}}
                classes={{ root: classes.root }}
              >
                <FavoriteBorderIcon style={iconStyle}/>
              </Fab>
            : null}
          </div>
        </div>
        <div style={{
          position:'absolute',
          bottom:'0',
          width:'100%',
          height:'50px',
          backgroundImage:'linear-gradient(rgba(0,0,0,0), #202020)',
        }}/>
      </div>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    likedRecipeIds: !!state.activeUser
      ? state.activeUser.likedRecipeIds.map(obj => obj.id)
      : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadRecipeDetailsStart: () => dispatch({ type: LOAD_RECIPE_DETAILS_START }),
    toggleDetailView: id => dispatch({ type: TOGGLE_RECIPE_DETAILS, id }),
    updateLikedRecipes: (id, recipeId, keep) => dispatch({
      type: UPDATE_USER_REQUESTED,
      updateType: LIKED_RECIPE_IDS,
      id, recipeId, keep
    })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeCard);