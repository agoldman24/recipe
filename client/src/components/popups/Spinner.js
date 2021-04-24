import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  paper: {
    overflow: "hidden",
    background: "none",
    boxShadow: "none",
  },
});

export default function Spinner({ isVisible }) {
  const classes = useStyles();
  return (
    <Dialog open={isVisible} classes={{ paper: classes.paper }}>
      <CircularProgress size={80} />
    </Dialog>
  );
}
