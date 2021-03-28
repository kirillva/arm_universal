import React from "react";
import {
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { runRpc } from "utils/rpc";

export const AppartamentDisableMenu = ({
  selectedAppartament,
  anchorEl,
  setAnchorEl,
  onSave = () => {},
  setOpen,
}) => {
  const onSendSelected = (b_check) => {
    runRpc({
      action: "cs_appartament",
      method: "Update",
      data: [{ b_disabled: !Boolean(b_check), id: selectedAppartament.id }],
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
          {selectedAppartament.b_disabled === true ? (
            <CheckBoxIcon />
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
        </ListItemIcon>
        Деактивировать
      </MenuItem>
      <MenuItem
        button
        onClick={() => {
          onSendSelected(true);
          setAnchorEl(null);
        }}
      >
        <ListItemIcon>
          {selectedAppartament.b_disabled === false ? (
            <CheckBoxIcon />
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
        </ListItemIcon>
        Активировать
      </MenuItem>
      <MenuItem
        button
        onClick={() => {
          setOpen(true);
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

export const AllAppartamentButtonsDisable = ({ appartaments, onSave = () => {} }) => {
  const onSendSelected = (b_disabled) => {
    runRpc({
      action: "cs_appartament",
      method: "Update",
      data: [appartaments.map((item) => ({ b_disabled: Boolean(b_disabled), id: item.id }))],
      type: "rpc",
    }).then((responce) => {
      onSave();
    });
  };

  return (
    <>
      <Typography style={{ margin: "16px 0 0 16px" }} variant="subtitle1">
        Квартиры
      </Typography>
      <div style={{ display: "flex", gap: "16px", margin: "16px 16px 0 16px" }}>
        <Button
          color="primary"
          style={{
            flex: 1,
          }}
          variant="contained"
          onClick={() => {
            onSendSelected(false);
          }}
        >
          Активировать все
        </Button>
        <Button
          color="primary"
          style={{
            flex: 1,
          }}
          variant="outlined"
          onClick={() => {
            onSendSelected(true);
          }}
        >
          Деактивировать все
        </Button>
      </div>
    </>
  );
};
