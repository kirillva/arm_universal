import React from "react";
import classNames from "classnames";
import { GetGUID } from "utils/helpers";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ComponentsPanelList from "./ComponentsPanelList";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const { edit: formEdit } = useSelector((state) => state.form);
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

  const addItem = (xtype) => {
    return () => {
      updateLayout({
        items: [...items, { xtype }],
        id: droppableId,
      });
    };
  };

  const toolsList = ComponentsPanelList();

  const onClickComponent = (item, droppableId, index) => {
    if (formEdit) {
      return () => {
        dispatch({
          type: "form/setSelectedComponent",
          containerId: droppableId, 
          componentId: index,
        });
      };
    } else {
      return () => { }
    }
  };

  return (
    <div className={formEdit ? classes.wrapper : ''}>
      {formEdit && <div className={classes.tools}>
        <Button color="primary" variant="contained" onClick={handleClick}>
          Действия
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {[
            {
              text: "Добавить горизонтальный контейнер",
              handler: addHorisontalLayout,
            },
            {
              text: "Добавить вертикальный контейнер",
              handler: addVerticalLayout,
            },
            { text: "Изменить тип контейнера", handler: changeLayout },
            { text: "Переместить контейнер вверх", handler: moveUp },
            { text: "Переместить контейнер вниз", handler: moveDown },
            { text: "Добавить текстовое поле", handler: addItem("textfield") },
            { text: "Добавить числовое поле", handler: addItem("numberfield") },
            {
              text: "Добавить поле с выбором опций",
              handler: addItem("combobox"),
            },
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
      </div>}
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
                {toolsList.items[item.xtype].getComponent(
                  item,
                  onClickComponent(item, droppableId, index)
                )}
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
