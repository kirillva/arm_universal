import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { GetGUID } from "utils/helpers";
// import { GetGUID } from "../../utils/Helpers";
// import TextField from "./Components/TextField";
// import CheckboxField from "./Components/CheckboxField";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  textFieldRoot: {
    flex: 1,
  },
}));

const ComponentsPanelList = () => {
  const classes = useStyles();
  const defaultList = {
    textfield: {
      id: GetGUID(),
      content: (
        <TextField
          name={"item.name"}
          classes={{ root: classes.textFieldRoot }}
          // style={{ margin: item.margin }}
          label={"item.fieldLabel"}
          variant="outlined"
        />
      ),
    },
    numberfield: {
      id: GetGUID(),
      content: (
        <TextField
          name={"item.name"}
          classes={{ root: classes.textFieldRoot }}
          // style={{ margin: item.margin }}
          label={"item.fieldLabel"}
          variant="outlined"
        />
      ),
    },
    combobox: {
      id: GetGUID(),
      content: (
        <TextField
          name={"item.name"}
          classes={{ root: classes.textFieldRoot }}
          // style={{ margin: item.margin }}
          label={"item.fieldLabel"}
          variant="outlined"
        />
      ),
    },
  };
  const [items] = useState(defaultList);

  return {
    items: items,
    getArray: () => {
      return Object.keys(items).map((xtype) => {
        return {
          id: items[xtype].id,
          xtype: xtype,
        };
      });
    },
  };
};

export default ComponentsPanelList;
