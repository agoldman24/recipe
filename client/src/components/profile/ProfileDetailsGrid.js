import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileDetail from "./ProfileDetail";
import UsersTable from "../tables/UsersTable";
import RecipeList from "../recipes/RecipeList";
import { columnStyle, tableStyle, rowStyle } from "../../styles";
import {
  FOLLOWERS,
  FOLLOWING,
  CREATED_RECIPES,
  LIKED_RECIPES,
} from "../../variables/Constants";

export default function ProfileDetailsGrid({
  displayUser: { id },
  displayUserDetail,
  setActiveDetail,
  activeUser,
  createdRecipes,
}) {
  const {
    followers,
    following,
    likedRecipes,
    likedRecipeIds,
    createdRecipeIds,
    activeDetail,
  } = displayUserDetail;
  const createdRecipesArray =
    !!activeUser && activeUser.id === id
      ? Object.values(createdRecipes).sort(
          (r1, r2) => r2.timestamp - r1.timestamp
        )
      : Object.values(displayUserDetail.createdRecipes).sort(
          (r1, r2) => r2.timestamp - r1.timestamp
        );
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row" id="profileDetailsBar" style={rowStyle}>
          <Grid
            item
            className="clickable"
            style={columnStyle}
            onClick={() => setActiveDetail(FOLLOWERS)}
          >
            <ProfileDetail
              isSelected={activeDetail === FOLLOWERS}
              number={Object.keys(followers).length}
              text="Followers"
            />
          </Grid>
          <Grid
            item
            className="clickable"
            style={columnStyle}
            onClick={() => setActiveDetail(FOLLOWING)}
          >
            <ProfileDetail
              isSelected={activeDetail === FOLLOWING}
              number={Object.keys(following).length}
              text="Following"
            />
          </Grid>
          <Grid
            item
            className="clickable"
            style={columnStyle}
            onClick={() => setActiveDetail(CREATED_RECIPES)}
          >
            <ProfileDetail
              isSelected={activeDetail === CREATED_RECIPES}
              number={createdRecipeIds.length}
              text="Created Recipes"
            />
          </Grid>
          <Grid
            item
            className="clickable"
            style={columnStyle}
            onClick={() => setActiveDetail(LIKED_RECIPES)}
          >
            <ProfileDetail
              isSelected={activeDetail === LIKED_RECIPES}
              number={likedRecipeIds.length}
              text="Liked Recipes"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item id="profileDetailsContent">
        {activeDetail === FOLLOWERS && (
          <div style={tableStyle}>
            <UsersTable users={Object.values(followers)} />
          </div>
        )}
        {activeDetail === FOLLOWING && (
          <div style={tableStyle}>
            <UsersTable users={Object.values(following)} />
          </div>
        )}
        {activeDetail === CREATED_RECIPES && (
          <RecipeList recipes={createdRecipesArray} />
        )}
        {activeDetail === LIKED_RECIPES && (
          <RecipeList
            keyword={""}
            recipes={likedRecipeIds
              .sort((obj1, obj2) => obj2.timestamp - obj1.timestamp)
              .map(({ id }) => likedRecipes[id])}
          />
        )}
      </Grid>
    </Grid>
  );
}
