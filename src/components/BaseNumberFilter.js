import React, { useState } from "react";
import { TextField, Button, IconButton } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import styles from "./BaseDatePicker.module.css";
import "moment/locale/ru";
import { Clear } from "@material-ui/icons";

const BaseNumberFromToFilter = ({
  className,
  onChange,
  InputProps,
  initialStart = null,
  initialFinish = null,
}) => {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialFinish);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    onChange({ start: start, finish: end });
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setAnchorEl(null);
    onChange({ start: null, finish: null });
    setStart(null);
    setEnd(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const renderPeriod = () => {
    if (!start && !end) {
      return "";
    }
    if (start && !end) {
      return start;
    }
    if (!start && end) {
      return end;
    }
    if (start && end) {
      return `${start} - ${end}`;
    }
    if (start.isSame(end)) {
      return start;
    }
    return "";
  };

  return (
    <>
      <TextField
        margin="none"
        size="small"
        variant="outlined"
        value={renderPeriod()}
        placeholder="Поиск..."
        className={className}
        inputProps={{
          onClick: handleClick
        }}
        InputProps={{
          contentEditable: false,
          endAdornment: (
            <IconButton onClick={handleCancel} size="small">
              <Clear />
            </IconButton>
          ),
          ...InputProps,
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles.fieldsWrapper}>
          <TextField
            label={"С"}
            value={start}
            // {...dataInputOptions}
            variant="outlined"
            onChange={(e) => {
              setStart(e.target.value);
            }}
            {...InputProps}
            margin="dense"
            autoOk
          />
          <TextField
            label={"По"}
            value={end}
            // {...dataInputOptions}
            variant="outlined"
            onChange={(e) => {
              setEnd(e.target.value);
            }}
            {...InputProps}
            margin="dense"
            autoOk
          />
        </div>
        <div className={styles.button}>
          <Button onClick={handleClose} variant={"contained"} color="primary">
            Применить
          </Button>
          <Button
            onClick={handleCancel}
            variant={"contained"}
            color="secondary"
          >
            Очистить
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default BaseNumberFromToFilter;
