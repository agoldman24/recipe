import React from 'react';
import Grid from '@material-ui/core/Grid';
import ProfileDetail from './ProfileDetail';
import UsersTable from '../tables/UsersTable';
import RecipeList from '../recipes/RecipeList';
import {
  FOLLOWERS,
  FOLLOWING,
  CREATED_RECIPES,
  SAVED_RECIPES
} from '../../variables/Constants';
import {
  columnStyle,
  tableStyle,
  rowStyle
} from "../../styles";

export default function ProfileDetailsGrid(props) {
  const {
    displayUser: { followerIds, followingIds, createdRecipeIds, savedRecipeIds },
    displayUserDetail
  } = props;

  return (
    <div>
      <Grid
        container
        direction="row"
        style={rowStyle}
      >
        <Grid item className="clickable" style={columnStyle} onClick={() => {
          props.setActiveDetail(FOLLOWERS);
        }}>
          <ProfileDetail
            isSelected={displayUserDetail.activeDetail === FOLLOWERS}
            number={followerIds.length}
            text="Followers"
          />
        </Grid>
        <Grid item className="clickable" style={columnStyle} onClick={() => {
            props.setActiveDetail(FOLLOWING);
          }}>
          <ProfileDetail
            isSelected={displayUserDetail.activeDetail === FOLLOWING}
            number={followingIds.length}
            text="Following"
          />
        </Grid>
        <Grid item className="clickable" style={columnStyle} onClick={() => {
          props.setActiveDetail(CREATED_RECIPES);
        }}>
          <ProfileDetail
            isSelected={displayUserDetail.activeDetail === CREATED_RECIPES}
            number={createdRecipeIds.length}
            text="Created Recipes"
          />
        </Grid>
        <Grid item className="clickable" style={columnStyle} onClick={() => {
          props.setActiveDetail(SAVED_RECIPES);
        }}>
          <ProfileDetail
            isSelected={displayUserDetail.activeDetail === SAVED_RECIPES}
            number={savedRecipeIds.length}
            text="Saved Recipes"
          />
        </Grid>
      </Grid>
      {displayUserDetail.activeDetail === FOLLOWERS &&
        <div style={tableStyle}>
          <UsersTable users={Object.values(displayUserDetail.followers)}/>
        </div>
      }
      {displayUserDetail.activeDetail === FOLLOWING &&
        <div style={tableStyle}>
          <UsersTable users={Object.values(displayUserDetail.following)}/>
        </div>
      }
      {displayUserDetail.activeDetail === CREATED_RECIPES &&
        <RecipeList recipes={Object.values(displayUserDetail.createdRecipes)}/>
      }
      {displayUserDetail.activeDetail === SAVED_RECIPES &&
        <RecipeList recipes={
          Object.values(displayUserDetail.savedRecipes).sort((r1, r2) => {
            return r2.timestamp - r1.timestamp;
          })
        }/>
      }
    </div>
  );
}