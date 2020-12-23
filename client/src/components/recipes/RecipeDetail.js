import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
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
  paddingTop: '20px',
}

class RecipeDetail extends React.Component {
  state = {
    anchorEl: null,
    ingredients: null,
    directions: null,
    likedId: null,
    isFetching: true,
    isDeleteModalVisible: false,
    headerHeight: 0
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
    if (!!document.getElementById("recipeHeader") &&
      document.getElementById("recipeHeader").offsetHeight !== this.state.headerHeight
    ) {
      this.setState({ headerHeight: document.getElementById("recipeHeader").offsetHeight  });
    }
    if (!this.props.isSpinnerVisible && prevProps.isSpinnerVisible && !!this.state.ingredients) {
      this.setState({ isFetching: true });
      Api.get('/getRecipeDetail?id=' + this.props.id).then(res => {
        this.setState({
          ingredients: res.data.ingredients,
          directions: res.data.directions,
          isFetching: false
        })
      });
    } else if (!this.props.isLiking && prevProps.isLiking) {
      this.setState({ likedId: null });
    }
  }
  render() {
    const { id, name, image, authorName, authorId, date } = this.props;
    const { ingredients, directions, isFetching } = this.state;
    return this.props.editMode && !isFetching
      ? <RecipeDetailEdit
          name={name}
          image={image}
          ingredients={ingredients}
          directions={directions}
          isCreateMode={false}
        />
      : <Card style={detailStyle}>
          <AppBar className={this.props.classes.appBar} id="recipeHeader">
            <Toolbar style={{minHeight:'0', padding:'5px 0'}}>
              <Grid container direction="row">
                <Grid item style={{width: this.props.isLoggedIn ? '10%' : '0'}}>
                  {this.props.isLoggedIn
                  ? this.props.isEditable
                    ? <IconButton onClick={e => this.setState({ anchorEl: e.currentTarget })}
                        disabled={!ingredients}
                        style={{color:'white'}}>
                        <MoreHorizIcon/>
                      </IconButton>
                    : this.props.isLiking && this.state.likedId === id
                      ? <CircularProgress size={21} style={{margin:'12px 12px 8px 12px', color:'white'}}/>
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
          <div style={{overflowY:'scroll', background:'#303030',
            height:'calc(100% - ' + this.state.headerHeight + 'px)'}}>
            <CardMedia id="recipeImage" component="img" image={image}/>
            <CardContent id="recipeTables" style={{background:'linear-gradient(45deg, #101010, transparent)',
              padding:'0', paddingBottom: isMobileOnly ? '50%' : '30%'}}>
              {isFetching
              ? <div style={loadingTextStyle}>Loading...</div>
              : <div>
                  <div style={{width:'100%', display:'flex'}}>
                    <Typography style={titleStyle} variant="h5">Ingredients</Typography>
                  </div>
                  <IngredientsTable ingredients={ingredients}/>
                  <Typography style={titleStyle} variant="h5">Directions</Typography>
                  {typeof directions === "string"
                  ? <Typography style={sectionStyle}>{directions}</Typography>
                  : <Grid container direction="column" style={{...sectionStyle, margin:'5px 0 0', padding:'0'}}>
                      {directions.map((step, index) => (
                        <Grid container direction="row" key={index} style={{paddingBottom:'10px'}}>
                          <Grid item style={{width:'30px'}}>
                            <Typography style={{
                              float: 'right',
                              paddingRight: '5px',
                              fontSize: '12.5px'
                            }}>
                              {index + 1 + "."}
                            </Typography>
                          </Grid>
                          <Grid item style={{width:'91%', paddingLeft:'5px'}}>
                            <Typography style={{fontSize:'12.5px'}}>{step}</Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                    }
                </div>
              }
            </CardContent>
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
          <PromptModal
            modalType="delete"
            isVisible={this.state.isDeleteModalVisible}
            closeModal={() => this.setState({ isDeleteModalVisible: false })}
            onConfirm={() => {
              this.setState({ isDeleteModalVisible: false });
              this.props.deleteRecipe();
            }}
            message={"Are you sure want to delete '" + name + "'?"}
          />
        </Card>
  }
};

export default withStyles(styles)(RecipeDetail);