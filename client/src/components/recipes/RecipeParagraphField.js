import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(() => ({
  multilineInputText: {
    fontSize: "16px",
    lineHeight: "1.5",
  },
  multilineTextField: {
    padding: "10px 5px 10px 12px",
  },
}));

export default function RecipeParagraphField({
  originalValue,
  setDirectionsParagraph,
  setGlobalDiff,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(originalValue);
  return (
    <TextField
      InputProps={{
        classes: {
          root: classes.multilineTextField,
          input: classes.multilineInputText,
        },
        onBlur: () => {
          setDirectionsParagraph(value);
          setGlobalDiff({ newDirectionsParagraph: value });
        },
      }}
      style={{ width: "95%", margin: "0 2.5% 10px 2.5%" }}
      variant="outlined"
      color="secondary"
      multiline
      rowsMax={10}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
