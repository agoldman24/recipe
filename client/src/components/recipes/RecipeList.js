import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import { withStyles } from "@material-ui/styles";
import Link from "@material-ui/core/Link";
import Zoom from "@material-ui/core/Zoom";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CircularProgress from "@material-ui/core/CircularProgress";
import RecipeDetail from "./RecipeDetail";
import PromptModal from "../popups/PromptModal";
import {
  GET_RECIPES_REQUESTED,
  UPDATE_USER_REQUESTED,
  SET_DETAIL_RECIPE,
  SET_DISPLAY_USER,
  SET_ACTIVE_TAB,
  GET_USER_DETAIL_REQUESTED,
  TOGGLE_RECIPE_EDIT_MODE,
  DELETE_RECIPE_REQUESTED,
} from "../../actions";
import {
  ALL_RECIPES,
  KEYWORD_RECIPES,
  FRIEND_RECIPES,
  CREATED_RECIPES,
  LIKED_RECIPES,
  LIKED_RECIPE_IDS,
  RECIPE_TAB,
  PROFILE_TAB,
  PUSH,
} from "../../variables/Constants";
import { centeredTextStyle, defaultTheme } from "../../styles";
import "../../index.css";

const styles = () => ({
  gridList: {
    transform: "translateZ(0)",
    width: "100%",
    padding: "0 5px",
  },
  titleBar: {
    background: "black",
    alignItems: "normal",
    height: "50px",
  },
  titleWrapActionPosRight: {
    marginLeft: "10px",
  },
  title: {
    padding: "5px 0 3px 0",
    fontFamily: "Shadows Into Light",
    fontSize: "18px",
  },
  tile: {
    paddingTop: "50px",
    borderRadius: "20px",
  },
  paper: {
    borderRadius: "0 4px 4px 4px",
    border: "1px solid white",
  },
  button: {
    textTransform: "none",
  },
});

const getDate = (timestamp) => {
  const dateArray = new Date(timestamp).toDateString().split(" ").slice(1);
  const date = dateArray[0] + " " + dateArray[1] + ", " + dateArray[2];
  return date;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const Image = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Fragment>
      <CircularProgress
        style={{
          display: isLoading ? "block" : "none",
          margin: "40px 40%",
          width: "20%",
          height: "auto",
        }}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        style={{
          top: "50%",
          width: "100%",
          position: "relative",
          transform: "translateY(-50%)",
          objectFit: "cover",
          display: isLoading ? "none" : "block",
        }}
      />
    </Fragment>
  );
};

class RecipeList extends React.Component {
  state = {
    isDetailOpen: false,
    isDeleteModalVisible: false,
    detailRecipe: null,
    likedId: null,
    pickedIndex: null,
    anchorEl: null,
  };
  componentDidUpdate(prevProps) {
    if (!this.props.isSpinnerVisible && prevProps.isSpinnerVisible) {
      if (!this.props.detailRecipe) {
        this.setState({ isDetailOpen: false });
        setTimeout(() => this.setState({ detailRecipe: null }), 1);
      } else {
        this.setState({ detailRecipe: this.props.detailRecipe });
      }
    } else if (!this.props.isLiking && prevProps.isLiking) {
      this.setState({ likedId: null });
    }
  }
  fetchRecipes() {
    this.props.getRecipes(
      this.props.activeTab,
      this.props.keyword,
      this.props.recipeCategory,
      this.props.friendRecipes,
      this.props.createdRecipes,
      this.props.users,
      this.props.activeUser,
      this.props.displayUser,
      this.props.displayUserDetail
    );
  }
  render() {
    return (
      <Fragment>
        <GridList
          cellHeight={240}
          className={this.props.classes.gridList}
          cols={isMobileOnly ? 1 : 4}
        >
          {this.props.recipes.map((recipe, index) =>
            !recipe ? null : (
              <GridListTile
                key={recipe.id}
                className="cardMedia"
                style={{
                  height: "190px",
                  width: isMobileOnly ? "calc(50% - 10px)" : "calc(20% - 10px)",
                  margin: "5px",
                  padding: "0",
                  background: "#202020",
                  borderRight: isMobileOnly ? "none" : "2px solid black",
                  borderBottom: "2px solid black",
                  borderRadius: "20px",
                }}
                classes={{
                  tile: this.props.classes.tile,
                }}
                onClick={() => {
                  this.setState({ isDetailOpen: true, detailRecipe: recipe });
                  this.props.setDetailRecipe(recipe);
                }}
              >
                <Image src={recipe.image} alt={recipe.name} />
                <GridListTileBar
                  className={this.props.classes.titleBar}
                  classes={{
                    title: this.props.classes.title,
                    titleWrapActionPosRight: this.props.classes
                      .titleWrapActionPosRight,
                  }}
                  title={recipe.name}
                  subtitle={
                    <div style={{ color: "#bbbbbb" }}>
                      {!recipe.authorName ? (
                        "Anonymous"
                      ) : (
                        <div>
                          <Link
                            href="#"
                            onClick={() =>
                              this.props.visitUserProfile(
                                this.props.users[recipe.authorId],
                                this.props.activeTab,
                                this.props.displayUser
                              )
                            }
                            style={{ color: "#45bbff" }}
                          >
                            {recipe.authorName}
                          </Link>{" "}
                          · {getDate(recipe.timestamp)}
                        </div>
                      )}
                    </div>
                  }
                  titlePosition="top"
                  actionPosition="left"
                  actionIcon={
                    this.props.isLoggedIn ? (
                      this.props.createdRecipeIds.includes(recipe.id) ? (
                        <IconButton
                          style={{ padding: "15px 5px" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            this.setState({
                              pickedIndex: index,
                              anchorEl: event.currentTarget,
                            });
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      ) : this.props.isLiking &&
                        this.state.likedId === recipe.id ? (
                        <CircularProgress
                          size={21}
                          style={{ margin: "15px 8px", color: "white" }}
                        />
                      ) : this.props.likedRecipeIds.includes(recipe.id) ? (
                        <IconButton
                          style={{ padding: "15px 8px" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            this.setState({ likedId: recipe.id });
                            this.props.updateLikedRecipes(
                              this.props.activeUser.id,
                              recipe.id,
                              false
                            );
                          }}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          style={{ padding: "15px 8px" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            this.setState({ likedId: recipe.id });
                            this.props.updateLikedRecipes(
                              this.props.activeUser.id,
                              recipe.id,
                              true
                            );
                          }}
                        >
                          <FavoriteBorderIcon />
                        </IconButton>
                      )
                    ) : null
                  }
                />
              </GridListTile>
            )
          )}
          <div style={centeredTextStyle}>
            {this.props.isFetchingRecipes && !this.props.keyword.length
              ? "Loading Recipes..."
              : !this.props.isSpinnerVisible &&
                !this.props.recipesFetched &&
                !this.props.networkFailed && (
                  <Link
                    href="#"
                    onClick={() => this.fetchRecipes()}
                    style={{
                      fontSize: "14px",
                      color: defaultTheme.palette.primary.main,
                    }}
                  >
                    Load more recipes
                  </Link>
                )}
          </div>
        </GridList>
        {!this.props.isFetchingRecipes &&
          !this.props.isSpinnerVisible &&
          !this.props.recipes.length && (
            <div style={centeredTextStyle}>
              <h4>
                {!!this.props.displayUserDetail &&
                this.props.displayUserDetail.activeDetail === LIKED_RECIPES
                  ? "No Liked Posts Yet"
                  : "No Posts to Display"}
              </h4>
            </div>
          )}
        <Dialog
          disableBackdropClick
          style={{ zIndex: "1302" }}
          open={this.state.isDetailOpen}
          TransitionComponent={Transition}
        >
          {this.state.detailRecipe && (
            <RecipeDetail
              id={this.state.detailRecipe.id}
              name={this.state.detailRecipe.name}
              image={this.state.detailRecipe.image}
              authorName={this.state.detailRecipe.authorName}
              authorId={this.state.detailRecipe.authorId}
              date={getDate(this.state.detailRecipe.timestamp)}
              onClose={() => this.setState({ isDetailOpen: false })}
              visitUserProfile={this.props.visitUserProfile}
              toggleEditMode={this.props.toggleEditMode}
              deleteRecipe={this.props.deleteRecipe}
              updateLikedRecipes={this.props.updateLikedRecipes}
              activeUser={this.props.activeUser}
              isLoggedIn={this.props.isLoggedIn}
              displayUser={this.props.displayUser}
              users={this.props.users}
              activeTab={this.props.activeTab}
              likedRecipeIds={this.props.likedRecipeIds}
              isLiking={this.props.isLiking}
              isSpinnerVisible={this.props.isSpinnerVisible}
              editMode={this.props.editMode}
              isEditable={
                !this.props.createdRecipeIds
                  ? null
                  : this.props.createdRecipeIds.includes(
                      this.state.detailRecipe.id
                    )
              }
            />
          )}
        </Dialog>
        <Popover
          open={!!this.state.anchorEl}
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          classes={{
            paper: this.props.classes.paper,
          }}
        >
          <Grid container direction="column">
            <Grid
              item
              style={{ background: "black", borderBottom: "1px solid white" }}
            >
              <Button
                startIcon={<CreateIcon />}
                className={this.props.classes.button}
                style={{ fontSize: "16px", fontFamily: "Signika" }}
                onClick={() => {
                  const detailRecipe = this.props.recipes[
                    this.state.pickedIndex
                  ];
                  this.setState({
                    detailRecipe,
                    isDetailOpen: true,
                    anchorEl: null,
                  });
                  this.props.setDetailRecipe(detailRecipe);
                  this.props.toggleEditMode();
                }}
              >
                Edit
              </Button>
            </Grid>
            <Grid item style={{ background: "black" }}>
              <Button
                className={this.props.classes.button}
                style={{
                  fontSize: "16px",
                  width: "100%",
                  fontFamily: "Signika",
                }}
                onClick={() =>
                  this.setState({ anchorEl: null, isDeleteModalVisible: true })
                }
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Popover>
        <PromptModal
          modalType="action"
          actionText="Delete"
          isVisible={this.state.isDeleteModalVisible}
          closeModal={() => this.setState({ isDeleteModalVisible: false })}
          onConfirm={() => {
            this.setState({ isDeleteModalVisible: false });
            this.props.deleteRecipe(
              this.props.recipes[this.state.pickedIndex].id
            );
          }}
          message={
            this.state.isDeleteModalVisible
              ? "Are you sure want to delete '" +
                this.props.recipes[this.state.pickedIndex].name +
                "'?"
              : ""
          }
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    editMode: state.recipeEditMode,
    activeTab: state.activeTab,
    recipeCategory: state.recipeCategory,
    friendRecipes: state.friendRecipes,
    createdRecipes: state.createdRecipes,
    detailRecipe: state.detailRecipe,
    users: state.users,
    isLoggedIn: !!state.activeUser,
    activeUser: state.activeUser,
    likedRecipeIds: !!state.activeUser
      ? state.activeUser.likedRecipeIds.map((obj) => obj.id)
      : null,
    createdRecipeIds: !!state.activeUser
      ? state.activeUser.createdRecipeIds.map((obj) => obj.id)
      : null,
    displayUser: state.displayUser,
    displayUserDetail: state.displayUserDetail,
    isLiking: state.isLiking,
    isSpinnerVisible: state.isSpinnerVisible,
    isFetchingRecipes: state.isFetchingRecipes,
    networkFailed: state.errorMessages.networkFailed,
    recipesFetched:
      (state.activeTab.name === RECIPE_TAB &&
        ((state.recipeCategory === "All" && state.recipesFetched.all) ||
          (state.recipeCategory === "By Friends" &&
            state.recipesFetched.friends) ||
          (state.recipeCategory === "By Me" &&
            state.recipesFetched.created))) ||
      (!!state.displayUserDetail &&
        ((state.displayUserDetail.activeDetail === CREATED_RECIPES &&
          (!!state.activeUser &&
          !!state.displayUser &&
          state.activeUser.id === state.displayUser.id
            ? state.recipesFetched.created
            : state.recipesFetched.displayUserCreated)) ||
          (state.displayUserDetail.activeDetail === LIKED_RECIPES &&
            state.recipesFetched.liked))),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDetailRecipe: (recipe) => dispatch({ type: SET_DETAIL_RECIPE, recipe }),
    toggleEditMode: () => dispatch({ type: TOGGLE_RECIPE_EDIT_MODE }),
    deleteRecipe: (id) => dispatch({ type: DELETE_RECIPE_REQUESTED, id }),
    updateLikedRecipes: (id, recipeId, keep) =>
      dispatch({
        type: UPDATE_USER_REQUESTED,
        updateType: LIKED_RECIPE_IDS,
        id,
        recipeId,
        keep,
      }),
    getRecipes: (
      activeTab,
      keyword,
      recipeCategory,
      friendRecipes,
      createdRecipes,
      users,
      activeUser,
      displayUser,
      displayUserDetail
    ) => {
      const requestType =
        activeTab.name === RECIPE_TAB
          ? !!keyword.length
            ? KEYWORD_RECIPES
            : recipeCategory === "All"
            ? ALL_RECIPES
            : recipeCategory === "By Friends"
            ? FRIEND_RECIPES
            : CREATED_RECIPES
          : displayUserDetail.activeDetail;
      let ids = null;
      switch (requestType) {
        case FRIEND_RECIPES:
          ids = activeUser.followingIds.reduce((accum, friendId) => {
            users[friendId].createdRecipeIds
              .filter((obj) => !Object.keys(friendRecipes).includes(obj.id))
              .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .forEach((r) => accum.push(r));
            return accum;
          }, []);
          break;
        case CREATED_RECIPES:
          let recipes, recipeIds;
          const activeUserIsDisplayUser =
            !!activeUser && !!displayUser && activeUser.id === displayUser.id;
          if (activeTab.name === RECIPE_TAB || activeUserIsDisplayUser) {
            recipes = createdRecipes;
            recipeIds = activeUser.createdRecipeIds;
          } else {
            recipes = displayUserDetail.createdRecipes;
            recipeIds = displayUserDetail.createdRecipeIds;
          }
          ids = recipeIds
            .filter((obj) => !Object.keys(recipes).includes(obj.id))
            .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp);
          break;
        case LIKED_RECIPES:
          ids = displayUserDetail.likedRecipeIds
            .filter(
              (obj) =>
                !Object.keys(displayUserDetail.likedRecipes).includes(obj.id)
            )
            .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp);
          break;
        default:
          break;
      }
      dispatch({
        type: GET_RECIPES_REQUESTED,
        requestType,
        ids,
        keyword,
      });
    },
    visitUserProfile: (user, currentTab, displayUser) => {
      dispatch({ type: SET_DISPLAY_USER, user });
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: {
          name: currentTab.name,
          displayUserId: !!displayUser ? displayUser.id : null,
        },
        newTab: { name: PROFILE_TAB },
        operation: PUSH,
      });
      dispatch({ type: GET_USER_DETAIL_REQUESTED });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecipeList));
