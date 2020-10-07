import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import RecipeDetailEdit from './RecipeDetailEdit';
import IngredientsTable from '../tables/IngredientsTable';
import {
  TOGGLE_RECIPE_DETAILS,
  TOGGLE_RECIPE_EDIT_MODE,
  UPDATE_USER_REQUESTED,
  GET_RECIPE_DETAIL_REQUESTED
} from '../../actions';
import { RECIPE_TAB, CREATED_RECIPES, LIKED_RECIPE_IDS } from '../../variables/Constants';
import {
  fabStyle, iconStyle, blackIconStyle, whiteFadeBackgroundStyle,
  detailStyle, headerStyle, titleStyle, sectionStyle
} from '../../styles';

const styles = () => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white'
  },
  root: {
    marginTop: '-10px'
  }
});

const loadingTextStyle = {
  textAlign: 'center',
  fontSize:'16px',
  marginTop:'20px'
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit/>;
});

class RecipeDetail extends React.Component {
  state = {
    anchorEl: null
  }
  componentDidMount() {
    if (!this.props.createMode) {
      this.props.fetchRecipeDetails(this.props.id);
    }
  }
  render() {
    const { id, name, image, ingredients, directions } = this.props;
    return (
      <Dialog
        disableBackdropClick
        open={this.props.open}
        onClose={this.props.toggleDetailView}
        TransitionComponent={Transition}
      >
        {this.props.editMode || this.props.createMode
        ? <RecipeDetailEdit
            name={name}
            image={image}
            ingredients={ingredients}
            directions={directions}
          />
        : <div>
          <Card style={detailStyle}>
            <CardHeader
              title={
                <Typography
                  variant="h3"
                  style={{
                    fontWeight:'bold', fontFamily:'Shadows Into Light'
                  }}
                >
                  {name}
                </Typography>
              }
              style={headerStyle}
            />
            <CardMedia
              style={{height:"0", paddingTop:"100%", position:'relative'}}
              image={image}
              children={[]}
            >
              <div style={{...whiteFadeBackgroundStyle, zIndex:'99'}}>
                {this.props.isLoggedIn &&
                  this.props.createdRecipeIds.includes(id) &&
                  <Fab
                    style={{
                      ...fabStyle,
                      position: 'fixed',
                      top: '15px',
                      right: isMobile ? '0' : 'calc(50vw - 240px)'
                    }}
                    disabled={!ingredients}
                  >
                    <MenuRoundedIcon
                      style={{
                        ...iconStyle,
                        background: !!this.state.anchorEl ? '#292929' : 'none',
                        color: !!this.state.anchorEl ? 'white' : 'black',
                        border: !!this.state.anchorEl ? '1px solid white' : 'none'
                      }}
                      onClick={e => this.setState({ anchorEl: e.currentTarget })}
                    />
                  </Fab>
                }
                <Fab
                  style={{
                    ...fabStyle,
                    position: 'fixed',
                    top: '65px',
                    right: isMobile ? '0' : 'calc(50vw - 240px)'
                  }}
                  onClick={() => this.props.toggleDetailView()}
                >
                  <CloseRoundedIcon style={blackIconStyle} />
                </Fab>
                {this.props.isLoggedIn
                ? this.props.likedRecipeIds.includes(id)
                  ? <Fab
                      onClick={() => this.props.updateLikedRecipes(
                        this.props.activeUser.id, id, false
                      )}
                      style={{...fabStyle, float:'left'}}
                      classes={{ root: this.props.classes.root }}
                    >
                      <FavoriteIcon style={iconStyle}/>
                    </Fab>
                  : <Fab
                      onClick={() => this.props.updateLikedRecipes(
                        this.props.activeUser.id, id, true
                      )}
                      style={{...fabStyle, float:'left'}}
                      classes={{ root: this.props.classes.root }}
                    >
                      <FavoriteBorderIcon style={iconStyle}/>
                    </Fab>
                : null
                }
              </div>
              {!ingredients ? <div style={loadingTextStyle}>Loading...</div> :
              <div>
                <div style={{width:'100%', display:'flex'}}>
                  <Typography style={{...titleStyle, padding:'10px'}} variant="h4">Ingredients</Typography>
                </div>
                <IngredientsTable ingredients={ingredients}/>
                <Typography style={{...titleStyle, padding:'10px'}} variant="h4">Directions</Typography>
                <div style={{paddingLeft: isMobile ? '5px' : '0'}}>
                  {typeof directions === "string"
                  ? <Typography style={sectionStyle}>{directions}</Typography>
                  : <Grid container direction="column" style={{paddingBottom:'50%'}}>
                      {directions.map((step, index) => (
                        <Grid container direction="row" key={index} style={{paddingBottom:'10px'}}>
                          <Grid item style={{width:'6%'}}>
                            <Typography style={{
                              float: 'right',
                              paddingRight: '5px',
                              fontSize: '14px'
                            }}>
                              {index + 1 + "."}
                            </Typography>
                          </Grid>
                          <Grid item style={{width:'91%', paddingLeft:'5px'}}>
                            <Typography style={{fontSize:'14px'}}>{step}</Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  }
                </div>
              </div>}
            </CardMedia>
          </Card>
          <Popover
            open={!!this.state.anchorEl}
            anchorEl={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            classes={{
              paper: this.props.classes.paper
            }}
          >
            <Grid container direction="column">
              <Grid item style={{background:'#292929', borderBottom:'1px solid white'}}>
                <Button
                  startIcon={<CreateIcon/>}
                  className={this.props.classes.button}
                  style={{fontSize:'16px', fontFamily:'Signika'}}
                  onClick={() => {
                    this.setState({ anchorEl: null });
                    this.props.toggleEditMode();
                  }}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item style={{background:'#292929'}}>
                <Button
                  className={this.props.classes.button}
                  style={{fontSize:'16px', width:'100%', fontFamily:'Signika'}}
                  onClick={() => {
                    this.setState({ anchorEl: null });
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Popover>
        </div>
        }
      </Dialog>
    );
  }
};

const mapStateToProps = state => {
  const recipe = !state.detailRecipe.id
    ? { name: "", image: "" }
    : state.activeTab.name === RECIPE_TAB
      ? state.recipeCategory === "Anonymous"
        ? state.sampleRecipes[state.detailRecipe.id]
        : state.recipeCategory === "By Friends"
          ? state.friendRecipes[state.detailRecipe.id]
          : state.createdRecipes[state.detailRecipe.id]
      : state.displayUserDetail.activeDetail === CREATED_RECIPES
        ? !!state.activeUser && state.activeUser.id === state.displayUser.id
          ? state.createdRecipes[state.detailRecipe.id]
          : state.displayUserDetail.createdRecipes[state.detailRecipe.id]
        : state.displayUserDetail.likedRecipes[state.detailRecipe.id];
  return {
    activeUser: state.activeUser,
    isLoggedIn: !!state.activeUser,
    createdRecipeIds: !!state.activeUser
      ? state.activeUser.createdRecipeIds.map(obj => obj.id)
      : null,
    likedRecipeIds: !!state.activeUser
      ? state.activeUser.likedRecipeIds.map(obj => obj.id)
      : null,
    open: !!state.detailRecipe.id || state.recipeCreateMode,
    id: state.detailRecipe.id,
    name: recipe.name,
    image: recipe.image,
    ingredients: state.recipeCreateMode ? [] : state.detailRecipe.ingredients,
    directions: state.recipeCreateMode ? [] : state.detailRecipe.directions,
    editMode: state.recipeEditMode,
    createMode: state.recipeCreateMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDetailView: () => dispatch({ type: TOGGLE_RECIPE_DETAILS }),
    fetchRecipeDetails: id => dispatch({ type: GET_RECIPE_DETAIL_REQUESTED, id }),
    toggleEditMode: () => dispatch({ type: TOGGLE_RECIPE_EDIT_MODE }),
    updateLikedRecipes: (id, recipeId, keep) => dispatch({
      type: UPDATE_USER_REQUESTED,
      updateType: LIKED_RECIPE_IDS,
      id, recipeId, keep
    }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecipeDetail));