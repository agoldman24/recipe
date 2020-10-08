import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { GET_RECIPES_REQUESTED } from '../../actions';
import {
  RECIPE_TAB, SAMPLE_RECIPES, FRIEND_RECIPES,
  CREATED_RECIPES, LIKED_RECIPES
} from "../../variables/Constants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit/>;
});

class RecipeList extends React.Component {
  state = {
    isDetailOpen: false,
    detailRecipeId: null
  }
  render() {
  return (
    <div style={{paddingBottom:'100px'}} id="recipes">
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
      <Grid
        container
        direction={isMobile ? "column" : "row"}
        justify="center"
      >
        {Object.values(this.props.recipes).sort((r1, r2) => r2.timestamp - r1.timestamp).map(recipe => {
          return (
            <Grid item key={recipe.id}
              style={{padding: isMobile ? '0' : '10px 5px 0 5px'}}
            >
              <RecipeCard
                id={recipe.id}
                name={recipe.name}
                image={recipe.image}
                onClick={() => {
                  this.setState({ isDetailOpen: true });
                  this.setState({ detailRecipeId: recipe.id });
                }}
              />
            </Grid>
          );
        })
        }
      </Grid>
      {!this.props.allRecipesFetched &&
        <div style={{width:'100%', textAlign:'center', paddingTop:'20px'}}>
          <Link
            href="#"
            style={{fontSize:'16px'}}
            onClick={e => {
              e.preventDefault();
              this.props.getRecipes(
                this.props.activeTab,
                this.props.recipeCategory,
                this.props.friendRecipes,
                this.props.createdRecipes,
                this.props.users,
                this.props.activeUser,
                this.props.displayUser,
                this.props.displayUserDetail
              );
            }}
          >
            Load more recipes
          </Link>
        </div>
      }
    </div>
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
    activeUser: state.activeUser,
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
)(RecipeList);