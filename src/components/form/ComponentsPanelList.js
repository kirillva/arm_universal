import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { GetGUID } from "utils/helpers";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  textFieldRoot: {
    flex: 1,
  },
}));

const ComponentsPanelList = () => {
  const classes = useStyles();

  const { edit: formEdit } = useSelector((state) => state.form);

  const defaultList = {
    textfield: {
      id: GetGUID(),
      getComponent: (item, onClick) => {
        return (
          <TextField
            disabled={formEdit}
            onClick={onClick}
            name={item.name}
            classes={{ root: classes.textFieldRoot }}
            style={{ margin: item.margin, padding: item.padding }}
            label={item.fieldLabel}
            variant="outlined"
          />
        );
      },
    },
    numberfield: {
      id: GetGUID(),
      getComponent: (item, onClick) => {
        return (
          <TextField
            disabled={formEdit}
            onClick={onClick}
            name={item.name}
            classes={{ root: classes.textFieldRoot }}
            style={{ margin: item.margin, padding: item.padding }}
            label={item.fieldLabel}
            variant="outlined"
          />
        );
      },
    },
    combobox: {
      id: GetGUID(),
      getComponent: (item, onClick) => {
        return (
          <TextField
            disabled={formEdit}
            onClick={onClick}
            name={item.name}
            classes={{ root: classes.textFieldRoot }}
            style={{ margin: item.margin, padding: item.padding }}
            label={item.fieldLabel}
            variant="outlined"
          />
        );
      },
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
