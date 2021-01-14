import React from "react";
import classNames from "classnames";
import { GetGUID } from "utils/helpers";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ComponentsPanelList from "./ComponentsPanelList";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    outline: "2px dashed black",
    margin: "3px",
    flex: 1,
  },
  tools: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    margin: theme.spacing(1),
  },
  vertical: {
    display: "flex",
    flexDirection: "column",
  },
  horisontal: {
    display: "flex",
    flexDirection: "row",
  },
}));

const BaseLayout = ({
  items,
  droppableId,
  children,
  parentId,
  updateLayout,
  horisontal,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addHorisontalLayout = () => {
    updateLayout({
      items: [],
      id: GetGUID(),
      parentId: [...parentId, droppableId],
      options: { horisontal: true },
    });
  };
  const addVerticalLayout = () => {
    updateLayout({
      items: [],
      id: GetGUID(),
      parentId: [...parentId, droppableId],
      options: { horisontal: false },
    });
  };
  const changeLayout = () => {
    updateLayout({
      items: items,
      id: droppableId,
      options: {
        horisontal: !horisontal,
      },
    });
  };
  const moveUp = () => {
    updateLayout({
      items: items,
      id: droppableId,
      moveUp: true,
    });
  };
  const moveDown = () => {
    updateLayout({
      items: items,
      id: droppableId,
      moveDown: true,
    });
  };
  const addItem = (name) => {
    return () => {
      switch (name) {
        case "textfield":
          break;
        case "numberfield":
          break;
        case "combobox":
          break;

        default:
          return "null";
      }
    };
  };

  const toolsList = ComponentsPanelList();

  return (
    <div className={classes.wrapper}>
      <div className={classes.tools}>
        <Button color="primary" variant="contained" onClick={handleClick}>
          ONCLICK
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {[
            { text: "HBOX", handler: addHorisontalLayout },
            { text: "VBOX", handler: addVerticalLayout },
            { text: "CHANGE", handler: changeLayout },
            { text: "Вверх", handler: moveUp },
            { text: "Вниз", handler: moveDown },
            { text: "textfield", handler: addItem("textfield") },
            { text: "numberfield", handler: addItem("numberfield") },
            { text: "combobox", handler: addItem("combobox") },
          ].map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => {
                handleClose();
                item.handler();
              }}
            >
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div
        className={classNames({
          [classes.vertical]: !horisontal,
          [classes.horisontal]: horisontal,
        })}
      >
        <div
          className={classNames({
            [classes.vertical]: !horisontal,
            [classes.horisontal]: horisontal,
          })}
        >
          {items.map((item, index) => {
            return (
              <div>
                {toolsList.items[item.xtype].content}
              </div>
            );
          })}
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
