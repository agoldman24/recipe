import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
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
import PromptModal from '../popups/PromptModal';
import Api from '../../api/siteUrl';
import { LIKED_RECIPE_IDS } from '../../variables/Constants';
import { TOGGLE_RECIPE_EDIT_MODE, UPDATE_USER_REQUESTED, DELETE_RECIPE_REQUESTED } from '../../actions';
import { detailStyle, headerStyle, titleStyle, sectionStyle } from '../../styles';

const styles = () => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '0 4px 4px 4px',
    border: '1px solid white'
  },
  appBar: {
    position: 'relative',
    background: 'black'
  }
});

const loadingTextStyle = {
  textAlign: 'center',
  fontSize: '16px',
  marginTop: '20px'
}

class RecipeDetail extends React.Component {
  state = {
    anchorEl: null,
    ingredients: null,
    directions: null,
    likedId: null,
    isFetching: true,
    isDeleteModalVisible: false
  }
  componentDidMount() {
    Api.get('/getRecipeDetail?id=' + this.props.id).then(res => {
      this.setState({
        ingredients: res.data.ingredients,
        directions: res.data.directions,
        isFetching: false
      });
    });
  }
  componentDidUpdate(prevProps) {
    console.log(!!this.state.ingredients)
    if (!this.props.isSpinnerVisible && prevProps.isSpinnerVisible && !!this.state.ingredients) {
      this.setState({ isFetching: true });
      Api.get('/getRecipeDetail?id=' + this.props.id).then(res => {
        this.setState({
          ingredients: res.data.ingredients,
          directions: res.data.directions,
          isFetching: false
        });
      });
    } else if (!this.props.isLiking && prevProps.isLiking) {
      this.setState({ likedId: null });
    }
  }
  render() {
    const { id, name, image, authorName, authorId, date } = this.props;
    const { ingredients, directions } = this.state;
    const headerHeight = !!document.getElementById("recipeHeader")
      ? document.getElementById("recipeHeader").offsetHeight
      : 0;
    return this.props.editMode
      ? <RecipeDetailEdit
          name={name}
          image={image}
          ingredients={ingredients}
          directions={directions}
          isCreateMode={false}
        />
      : <Card style={detailStyle}>
          <PromptModal
            modalType="delete"
            isVisible={this.state.isDeleteModalVisible}
            closeModal={() => this.setState({ isDeleteModalVisible: false })}
            onConfirm={this.props.deleteRecipe}
            message={"Are you sure want to delete this recipe?"}
          />
          <AppBar className={this.props.classes.appBar} id="recipeHeader">
            <Toolbar style={{minHeight:'0', padding:'5px 0'}}>
              <Grid container direction="row">
                <Grid item style={{width: this.props.isLoggedIn ? '10%' : '0'}}>
                  {this.props.isLoggedIn
                  ? this.props.createdRecipeIds.includes(id)
                    ? <IconButton onClick={e => this.setState({ anchorEl: e.currentTarget })}
                        disabled={!ingredients}
                        style={{color:'white'}}>
                        <MoreHorizIcon/>
                      </IconButton>
                    : this.props.isLiking && this.state.likedId === id
                      ? <CircularProgress size={20} style={{margin:'12px', color:'white'}}/>
                      : this.props.likedRecipeIds.includes(id)
                        ? <IconButton
                            style={{padding:'12px'}}
                            onClick={() => {
                              this.setState({ likedId: id });
                              this.props.updateLikedRecipes(
                                this.props.activeUser.id, id, false
                              );
                            }}>
                            <FavoriteIcon/>
                          </IconButton>
                        : <IconButton
                            style={{padding:'12px'}}
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
                <Grid item style={{
                  margin: 'auto',
                  width: this.props.isLoggedIn ? '78%' : '88%',
                  paddingLeft: this.props.isLoggedIn ? '0' : '5%'
                }}>
                  <Typography style={headerStyle}>{name}</Typography>
                </Grid>
                <Grid item style={{width:'12%'}}>
                  <IconButton onClick={this.props.onClose}
                    style={{color:'white', paddingLeft: isMobileOnly ? '30%' : '45%'}}>
                    <CloseIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            </Toolbar>
            {!!authorName &&
              <div style={{display:'flex', background:'linear-gradient(45deg, black, #303030)', padding:'10px'}}>
                <div style={{margin:'auto'}}>
                  <div style={{color:'white'}}>
                    Posted by <Link href="#" onClick={() => this.props.visitUserProfile(
                      this.props.users[authorId],
                      this.props.activeTab,
                      this.props.displayUser
                    )} style={{color:'#45bbff'}}>
                      {authorName}
                    </Link> on {date}
                  </div>
                </div>
              </div>
            }
          </AppBar>
          <div style={{overflowY:'scroll', background:'#303030', height:'calc(100% - ' + headerHeight + 'px)'}}>
            <CardMedia image={image} style={{height:'0', paddingTop:'100%', position:'relative'}}>
              {this.state.isFetching
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
          <Popover
            open={!!this.state.anchorEl}
            anchorEl={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
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
              <Grid item style={{background:'black', borderBottom:'1px solid white'}}>
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
              <Grid item style={{background:'black'}}>
                <Button
                  className={this.props.classes.button}
                  style={{fontSize:'16px', width:'100%', fontFamily:'Signika'}}
                  onClick={() => this.setState({ anchorEl: null, isDeleteModalVisible: true })}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Popover>
        </Card>
  }
};

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser,
    isLoggedIn: !!state.activeUser,
    displayUser: state.displayUser,
    users: state.users,
    activeTab: state.activeTab,
    createdRecipeIds: !!state.activeUser
      ? state.activeUser.createdRecipeIds.map(obj => obj.id)
      : null,
    likedRecipeIds: !!state.activeUser
      ? state.activeUser.likedRecipeIds.map(obj => obj.id)
      : null,
    isLiking: state.isLiking,
    isSpinnerVisible: state.isSpinnerVisible,
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
    deleteRecipe: () => dispatch({ type: DELETE_RECIPE_REQUESTED })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecipeDetail));