import React from "react";
import { connect } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { defaultTheme } from "../../styles";
import { SET_ACTIVE_TAB } from "../../actions";
import { SIGN_UP_TAB } from "../../variables/Constants";

const AboutTab = (props) => {
  return (
    <div
      style={{ padding: isMobileOnly ? "10px 20px 100px 20px" : "20px 50px" }}
    >
      <Typography
        style={{
          fontFamily: "Raleway",
          fontSize: isMobileOnly ? "20px" : "22px",
        }}
      >
        RecipeBook is a digital collection of recipes supplied by food
        enthusiasts wishing to share their creations. Anyone with a desire to
        expand their culinary experience or explore new things to cook will find
        value in this community-driven menu of ideas. Once registered, you can
        follow other chefs, save recipes that you like, and post recipes of your
        own. Visit the{" "}
        <Link
          href="#"
          style={{ color: defaultTheme.palette.primary.main }}
          onClick={props.visitSignup}
        >
          Sign Up
        </Link>{" "}
        page to get started!
      </Typography>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    visitSignup: () =>
      dispatch({
        type: SET_ACTIVE_TAB,
        currentTab: null,
        newTab: { name: SIGN_UP_TAB },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutTab);
