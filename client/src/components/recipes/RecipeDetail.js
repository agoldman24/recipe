import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import RecipeDetailEdit from './RecipeDetailEdit';
import IngredientsTable from '../tables/IngredientsTable';
import Api from '../../api/siteUrl';
import { TOGGLE_RECIPE_EDIT_MODE, UPDATE_USER_REQUESTED } from '../../actions';
import { LIKED_RECIPE_IDS } from '../../variables/Constants';
import { detailStyle, headerStyle, titleStyle, sectionStyle } from '../../styles';

const styles = () => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '0 4px 4px 4px',
    border: '1px solid white'
  },
  root: {
    marginTop: '-10px'
  },
  appBar: {
    position: 'relative',
    background: '#292929'
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
    directions: null,
    likedId: null
  }
  componentDidMount() {
    Api.get('/getRecipeDetail?id=' + this.props.id).then(res => {
      this.setState({
        ingredients: res.data.ingredients,
        directions: res.data.directions
      });
    });
  }
  componentDidUpdate(prevProps) {
    if (!this.props.isLiking && prevProps.isLiking) {
      this.setState({ likedId: null });
    }
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
            <AppBar className={this.props.classes.appBar}>
              <Toolbar style={{padding:'0'}}>
                <Grid container direction="row">
                  <Grid item style={{width:'10%'}}>
                    {this.props.isLoggedIn
                    ? this.props.createdRecipeIds.includes(id)
                      ? <IconButton onClick={e => this.setState({ anchorEl: e.currentTarget })}
                          disabled={!ingredients}
                          style={{color:'white'}}>
                          <MoreHorizIcon/>
                        </IconButton>
                      : this.props.isLiking && this.state.likedId === id
                        ? <CircularProgress style={{width:'20px', height:'20px', margin:'12px', color:'white'}}/>
                        : this.props.likedRecipeIds.includes(id)
                          ? <IconButton
                              style={{padding:'12px 9px'}}
                              onClick={() => {
                                this.setState({ likedId: id });
                                this.props.updateLikedRecipes(
                                  this.props.activeUser.id, id, false
                                );
                              }}>
                              <FavoriteIcon/>
                            </IconButton>
                          : <IconButton
                              style={{padding:'12px 9px'}}
                              onClick={() => {
                                this.setState({ likedId: id });
                                this.props.updateLikedRecipes(
                                  this.props.activeUser.id, id, true
                                );
                              }}>
                              <FavoriteBorderIcon/>
                            </IconButton>
                    : null
                    }
                  </Grid>
                  <Grid item style={{width:'78%', margin:'auto'}}>
                    <Typography noWrap={true} style={headerStyle}>{name}</Typography>
                  </Grid>
                  <Grid item style={{width:'12%'}}>
                    <IconButton onClick={this.props.onClose} style={{color:'white', paddingLeft:'28px'}}>
                      <CloseIcon/>
                    </IconButton>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <div style={{height:'100%', overflowY:'scroll'}}>
              <CardMedia image={image} style={{height:'0', paddingTop:'100%', position:'relative'}}>
                {!ingredients
                ? <div style={loadingTextStyle}>Loading...</div>
                : <div>
                    <div style={{width:'100%', display:'flex'}}>
                      <Typography style={titleStyle} variant="h5">Ingredients</Typography>
                    </div>
                    <IngredientsTable ingredients={ingredients}/>
                    <Typography style={titleStyle} variant="h5">Directions</Typography>
                    {typeof directions === "string"
                    ? <Typography style={sectionStyle}>{directions}</Typography>
                    : <Grid container direction="column" style={{...sectionStyle, margin:'5px 0'}}>
                        {directions.map((step, index) => (
                          <Grid container direction="row" key={index} style={{paddingBottom:'10px'}}>
                            <Grid item style={{width:'30px'}}>
                              <Typography style={{
                                float: 'right',
                                paddingRight: '5px',
                                fontSize: '12px'
                              }}>
                                {index + 1 + "."}
                              </Typography>
                            </Grid>
                            <Grid item style={{width:'91%', paddingLeft:'5px'}}>
                              <Typography style={{fontSize:'12px'}}>{step}</Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                      }
                  </div>
                }
              </CardMedia>
            </div>
          </Card>
          <Popover
            open={!!this.state.anchorEl}
            anchorEl={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
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
    isLiking: state.isLiking,
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