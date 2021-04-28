import React, { useEffect } from "react";
import { connect } from "react-redux";
import UsersTable from "../tables/UsersTable";
import Api from "../../api/siteUrl";
import { UPDATE_USERS, REFRESH_COMPLETE } from "../../actions";

const UsersTab = ({
  usersArray,
  updateUsers,
  refreshNeeded,
  refreshComplete,
  keyword,
}) => {
  useEffect(() => {
    if (refreshNeeded) {
      Api.get("/getAllUsers").then((res) => {
        updateUsers(res.data.users);
        refreshComplete();
      });
    }
  }, [refreshNeeded, updateUsers, refreshComplete]);

  return (
    <UsersTable
      users={usersArray.filter(
        (user) =>
          user.username.toLowerCase().includes(keyword) ||
          user.firstName.toLowerCase().includes(keyword) ||
          user.lastName.toLowerCase().includes(keyword)
      )}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    usersArray: Object.values(state.users),
    refreshNeeded: state.refreshNeeded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUsers: (users) => dispatch({ type: UPDATE_USERS, users }),
    refreshComplete: () => dispatch({ type: REFRESH_COMPLETE }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersTab);
