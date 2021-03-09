import React from "react";
import { ListItemIcon, Menu, MenuItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { runRpc } from "utils/rpc";

export const AppartamentContextMenu = ({
  selectedAppartament,
  anchorEl,
  setAnchorEl,
  onSave = () => {},
}) => {
  const onSendSelected = (b_check) => {
    runRpc({
      action: "cs_appartament",
      method: "Update",
      data: [{ b_check: !Boolean(b_check), id: selectedAppartament.id }],
      type: "rpc",
    }).then((responce) => {
      onSave();
    });
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem
        button
        onClick={() => {
          onSendSelected(false);
          setAnchorEl(null);
        }}
      >
        <ListItemIcon>
          {selectedAppartament.b_check === true ? (
            <CheckBoxIcon />
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
        </ListItemIcon>
        Подтверждаю
      </MenuItem>
      <MenuItem
        button
        onClick={() => {
          onSendSelected(true);
          setAnchorEl(null);
        }}
      >
        <ListItemIcon>
          {selectedAppartament.b_check === false ? (
            <CheckBoxIcon />
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
        </ListItemIcon>
        Не подтверждаю
      </MenuItem>
      <MenuItem
        button
        onClick={() => {
          //   setOpen(true);
          setAnchorEl(null);
        }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        Указать примечание
      </MenuItem>
    </Menu>
  );
};
