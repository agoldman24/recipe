import React from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
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
import Api from '../../api/siteUrl';
import { TOGGLE_RECIPE_EDIT_MODE, UPDATE_USER_REQUESTED } from '../../actions';
import { LIKED_RECIPE_IDS } from '../../variables/Constants';
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

class RecipeDetail extends React.Component {
  state = {
    anchorEl: null,
    ingredients: null,
    directions: null
  }
  componentDidMount() {
    Api.get('/getRecipeDetail?id=' + this.props.id).then(res => {
      this.setState({
        ingredients: res.data.ingredients,
        directions: res.data.directions
      });
    });
  }
  render() {
    const { id, name, image } = this.props;
    const { ingredients, directions } = this.state;
    return this.props.editMode
      ? <RecipeDetailEdit
          name={name}
          image={image}
          ingredients={ingredients}
          directions={directions}
          isCreateMode={false}
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
                  onClick={this.props.onClose}
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
              }
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
};

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser,
    isLoggedIn: !!state.activeUser,
    createdRecipeIds: !!state.activeUser
      ? state.activeUser.createdRecipeIds.map(obj => obj.id)
      : null,
    likedRecipeIds: !!state.activeUser
      ? state.activeUser.likedRecipeIds.map(obj => obj.id)
      : null,
    editMode: state.recipeEditMode,
  };
};

const mapDispatchToProps = dispatch => {
  return {
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