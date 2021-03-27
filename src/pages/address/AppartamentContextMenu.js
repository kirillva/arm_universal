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

export const AppartamentContextMenu = ({
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

export const AllAppartamentButtons = ({ appartaments, onSave = () => {} }) => {
  const onSendSelected = (b_check) => {
    runRpc({
      action: "cf_bss_check_appartament_update",
      method: "Query",
      data: [
        {
          params: [
            appartaments.map((item) => `${item.id}`),
            !Boolean(b_check),
          ],
        },
      ],
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
          Подтверждаю все
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
          Не подтверждаю все
        </Button>
      </div>
    </>
  );
};
