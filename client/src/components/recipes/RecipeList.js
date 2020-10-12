import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { withStyles } from '@material-ui/styles';
import InfiniteScroll from "react-infinite-scroll-component";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import RecipeDetail from './RecipeDetail';
import { GET_RECIPES_REQUESTED, UPDATE_USER_REQUESTED } from '../../actions';
import {
  RECIPE_TAB, SAMPLE_RECIPES, FRIEND_RECIPES,
  CREATED_RECIPES, LIKED_RECIPES, LIKED_RECIPE_IDS
} from "../../variables/Constants";
import "../../index.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit/>;
});

const Image = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Fragment>
      <CircularProgress style={{
        display: isLoading ? 'block' : 'none',
        marginTop: '50%',
        width: '30%',
        marginLeft: '35%',
        height: 'auto'
      }}/>
      <img src={src} alt={alt} onLoad={() => setIsLoading(false)}
        style={{
          left: '50%',
          height: '100%',
          position: 'relative',
          transform: 'translateX(-50%)',
          display: isLoading ? 'block' : 'initial',
        }}
      />
    </Fragment>
  );
}

const styles = () => ({
  gridList: {
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  }
});

class RecipeList extends React.Component {
  state = {
    isDetailOpen: false,
    detailRecipeId: null
  }
  render() {
  return (
    <InfiniteScroll
      dataLength={Object.keys(this.props.recipes).length}
      next={() => this.props.getRecipes(
        this.props.activeTab,
        this.props.recipeCategory,
        this.props.friendRecipes,
        this.props.createdRecipes,
        this.props.users,
        this.props.activeUser,
        this.props.displayUser,
        this.props.displayUserDetail
      )}
      scrollableTarget={document.getElementById('container')}
      hasMore={!this.props.allRecipesFetched}
      loader={<h4>Loading...</h4>}
      style={{overflowX:'hidden'}}
    >
      <Dialog
        disableBackdropClick
        open={this.state.isDetailOpen}
        TransitionComponent={Transition}
      >
        {this.state.detailRecipeId &&
        <RecipeDetail
          id={this.state.detailRecipeId}
          name={this.props.recipes[this.state.detailRecipeId].name}
          image={this.props.recipes[this.state.detailRecipeId].image}
          onClose={() => {
            this.setState({ isDetailOpen: false });
            setTimeout(() => this.setState({ detailRecipeId: null }), 1);
          }}
        />
        }
      </Dialog>
      <GridList cellHeight={250}
        className={this.props.classes.gridList}
        cols={isMobile ? 1 : 5}
      >
        {Object.values(this.props.recipes)
          .sort((r1, r2) => r2.timestamp - r1.timestamp)
          .map((recipe) => (
            <GridListTile key={recipe.id} className="cardMedia"
              onClick={() => {
                this.setState({ isDetailOpen: true });
                this.setState({ detailRecipeId: recipe.id });
              }}
            >
              <Image src={recipe.image} alt={recipe.name} />
              <GridListTileBar
                title={recipe.name}
                titlePosition="top"
                actionIcon={this.props.isLoggedIn
                  ? this.props.likedRecipeIds.includes(recipe.id)
                    ? <IconButton
                        className={this.props.classes.icon}
                        onClick={event => {
                          event.stopPropagation();
                          this.props.updateLikedRecipes(
                            this.props.activeUser.id,
                            recipe.id, false
                          );
                        }}>
                        <FavoriteIcon/>
                      </IconButton>
                    : <IconButton
                        className={this.props.classes.icon}
                        onClick={event => {
                          event.stopPropagation();
                          this.props.updateLikedRecipes(
                            this.props.activeUser.id,
                            recipe.id, true
                          );
                        }}>
                        <FavoriteBorderIcon/>
                      </IconButton>
                    : null
                }
                actionPosition="left"
                className={this.props.classes.titleBar}
              />
            </GridListTile>
        ))}
      </GridList>
    </InfiniteScroll>
  );
  }
}

const mapStateToProps = state => {
  return {
    networkFailed: state.errorMessages.networkFailed,
    editMode: state.recipeEditMode,
    activeTab: state.activeTab,
    recipeCategory: state.recipeCategory,
    friendRecipes: state.friendRecipes,
    createdRecipes: state.createdRecipes,
    users: state.users,
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    likedRecipeIds: !!state.activeUser
      ? state.activeUser.likedRecipeIds.map(obj => obj.id)
      : null,
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    allRecipesFetched:
      (state.activeTab.name === RECIPE_TAB && (
        (state.recipeCategory === "Anonymous" && state.allRecipesFetched.samples) ||
        (state.recipeCategory === "By Friends" && state.allRecipesFetched.friends) ||
        (state.recipeCategory === "By Me" && state.allRecipesFetched.created)
      )) ||
      (!!state.displayUserDetail && (
        (state.displayUserDetail.activeDetail === CREATED_RECIPES
          && (!!state.activeUser && !!state.displayUser && state.activeUser.id === state.displayUser.id
            ? state.allRecipesFetched.created
            : state.allRecipesFetched.displayUserCreated)
        ) ||
        (state.displayUserDetail.activeDetail === LIKED_RECIPES
          && state.allRecipesFetched.liked)
      )
    )
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateLikedRecipes: (id, recipeId, keep) => dispatch({
      type: UPDATE_USER_REQUESTED,
      updateType: LIKED_RECIPE_IDS,
      id, recipeId, keep
    }),
    getRecipes: (
      activeTab,
      recipeCategory,
      friendRecipes,
      createdRecipes,
      users,
      activeUser,
      displayUser,
      displayUserDetail
    ) => {
      const requestType = activeTab.name === RECIPE_TAB
        ? recipeCategory === "Anonymous"
          ? SAMPLE_RECIPES
          : recipeCategory === "By Friends"
            ? FRIEND_RECIPES
            : CREATED_RECIPES
        : displayUserDetail.activeDetail;
      let ids = null;
      switch (requestType) {
        case FRIEND_RECIPES:
          ids = activeUser.followingIds.reduce((accum, friendId) => {
            users[friendId].createdRecipeIds.filter(obj =>
              !Object.keys(friendRecipes).includes(obj.id)
            ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .forEach(r => accum.push(r));
            return accum;
          }, []);
          break;
        case CREATED_RECIPES:
          let recipes, recipeIds;
          const activeUserIsDisplayUser = !!activeUser && !!displayUser && activeUser.id === displayUser.id;
          if (activeTab.name === RECIPE_TAB || activeUserIsDisplayUser) {
            recipes = createdRecipes;
            recipeIds = activeUser.createdRecipeIds;
          } else {
            recipes = displayUserDetail.createdRecipes;
            recipeIds = displayUser.createdRecipeIds;
          }
          ids = recipeIds.filter(obj => !Object.keys(recipes).includes(obj.id))
            .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp);
          break;
        case LIKED_RECIPES:
          ids = displayUser.likedRecipeIds.filter(obj =>
            !Object.keys(displayUserDetail.likedRecipes).includes(obj.id)
          ).sort((obj1, obj2) => obj2.timestamp - obj1.timestamp);
          break;
        default:
          break;
      }
      dispatch({ type: GET_RECIPES_REQUESTED, requestType, ids });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecipeList));