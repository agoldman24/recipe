import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class TemporarySpinner extends React.Component {
  componentDidMount() {
    setTimeout(() => this.props.destroySpinner(), 3000);
  }
  render() {
    return <CircularProgress size={20} style={{ color: "white" }} />;
  }
}
