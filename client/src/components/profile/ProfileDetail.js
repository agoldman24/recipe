import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  selected,
  unselected,
  highlightedNumberStyle,
  unhighlightedNumberStyle,
  highlightedTextStyle,
  unhighlightedTextStyle
} from "../../styles";

export default function ProfileDetail(props) {
  const containerStyle = props.isSelected ? selected : unselected;
  const numberStyle = props.isSelected ? highlightedNumberStyle : unhighlightedNumberStyle;
  const textStyle = props.isSelected ? highlightedTextStyle : unhighlightedTextStyle;
  return (
    <div style={containerStyle}>
      <Typography style={numberStyle}>
        {props.number}
      </Typography>
      <Typography style={textStyle}>
        {props.text}
      </Typography>
    </div>
  );
}