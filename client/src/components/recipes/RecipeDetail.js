import React, { createRef } from 'react';
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
import IngredientsTable from '../tables/IngredientsTable';
import { SAVED_RECIPE_IDS } from '../../variables/Constants';
import {
  TOGGLE_RECIPE_DETAILS,
  LOAD_RECIPE_DETAILS_FINISHED,
  TOGGLE_DETAIL_EDIT_MODE,
  TOGGLE_DETAIL_ADD_ROW_MODE,
  UPDATE_USER_REQUESTED
} from '../../actions';
import {
  fabStyle, iconStyle, blackIconStyle, darkBackgroundStyle, whiteFadeBackgroundStyle,
  detailStyle, headerStyle, titleStyle, sectionStyle
} from '../../styles';

const styles = () => ({
  button: {
    textTransform: 'none'
  },
  paper: {
    borderRadius: '4px 0 4px 4px',
    border: '1px solid white'
  }
});

class RecipeDetail extends React.Component {
  constructor() {
    super();
    this.tableRef = createRef();
    this.state = {
      anchorEl: null
    }
  }
  componentDidMount() {
    this.props.loadRecipeDetailsFinished();
  }
  render() {
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
                {this.props.name}
              </Typography>
            }
            style={headerStyle}
          />
          <CardMedia
            style={{height:"0", paddingTop:"100%", position:'relative'}}
            image={this.props.image}
            children={[]}
          >
            <div style={{...whiteFadeBackgroundStyle, zIndex:'99'}}>
              {this.props.isLoggedIn &&
                <div>
                  <Fab
                    style={{
                      ...fabStyle,
                      position: 'fixed',
                      top: '15px',
                      right: isMobile ? '0' : '21%'
                    }}
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
                  <Fab
                    style={{
                      ...fabStyle,
                      position: 'fixed',
                      top: '60px',
                      right: isMobile ? '0' : '21%'
                    }}
                    onClick={() => {
                      this.props.toggleDetailView();
                      document.getElementById('root').style.overflowY = 'auto';
                    }}
                  >
                    <CloseRoundedIcon style={blackIconStyle} />
                  </Fab>
                </div>
              }
              {this.props.isLoggedIn
              ? this.props.savedRecipeIds.includes(this.props.id)
                ? <Fab
                    onClick={() => this.props.updateSavedRecipes(
                      this.props.activeUser.id, this.props.id, false
                    )}
                    style={{...fabStyle, float:'left'}}
                  >
                    <FavoriteIcon style={iconStyle}/>
                  </Fab>
                : <Fab
                    onClick={() => this.props.updateSavedRecipes(
                      this.props.activeUser.id, this.props.id, true
                    )}
                    style={{...fabStyle, float:'left'}}
                  >
                    <FavoriteBorderIcon style={iconStyle}/>
                  </Fab>
              : null
              }
            </div>
            <div style={{width:'100%', display:'flex'}}>
              <Typography style={{...titleStyle, paddingBottom:'5px'}} variant="h3">Ingredients</Typography>
            </div>
            <IngredientsTable
              tableRef={this.tableRef}
              ingredients={this.props.ingredients}
              isEditable={this.props.editMode}
              addRowMode={this.props.addRowMode}
              toggleAddRowMode={this.props.toggleAddRowMode}
            />
            <Typography style={titleStyle} variant="h3">Directions</Typography>
            <Typography style={sectionStyle}>{this.props.directions}</Typography>
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
            <Grid item style={{background:'#292929', borderBottom: '1px solid white'}}>
              <Button
                startIcon={<CreateIcon/>}
                className={this.props.classes.button}
                style={{fontSize: '16px'}}
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
                style={{fontSize: '16px', paddingRight:'0'}}
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
    );
  }
};

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.activeUser,
    editMode: state.detailRecipe.editMode,
    addRowMode: state.detailRecipe.addRowMode,
    activeUser: state.activeUser,
    savedRecipeIds: !!state.activeUser
      ? state.activeUser.savedRecipeIds.map(obj => obj.id)
      : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDetailView: () => dispatch({ type: TOGGLE_RECIPE_DETAILS }),
    loadRecipeDetailsFinished: () => dispatch({ type: LOAD_RECIPE_DETAILS_FINISHED }),
    toggleEditMode: () => dispatch({ type: TOGGLE_DETAIL_EDIT_MODE }),
    toggleAddRowMode: () => dispatch({ type: TOGGLE_DETAIL_ADD_ROW_MODE }),
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
)(withStyles(styles)(RecipeDetail));