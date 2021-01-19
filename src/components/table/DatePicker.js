import React, { useState } from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { TextField, IconButton } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import DateRangeOutlined from "@material-ui/icons/DateRangeOutlined";
import "moment/locale/ru";

const DatePicker = ({
  value = {},
  className,
  onChange,
  DialogProps = {},
  error = false,
  errorText = "",
  label = "",
  InputProps,
  initialDateStart = null,
  initialDateFinish = null,
}) => {
  const [startDate, setStartDate] = useState(initialDateStart);
  const [endDate, setEndDate] = useState(initialDateFinish);

  const dataInputOptions = {
    variant: "inline",
    invalidDateMessage: "Некорректный формат даты",
    inputVariant: "outlined",
    format: "DD.MM.YYYY",
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getDate = (date) => {
    if (date && date.isValid()) {
      return date;
    }
  };

  const handleClose = () => {
    onChange({ start: getDate(startDate), finish: getDate(endDate) });
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const renderPeriod = () => {
    const _startDate = getDate(startDate);
    const _endDate = getDate(endDate);
    if (!_startDate && !_endDate) {
      return "";
    }
    if (_startDate && !_endDate) {
      return _startDate.format("DD.MM.YYYY");
    }
    if (!_startDate && _endDate) {
      return _endDate.format("DD.MM.YYYY");
    }
    if (_startDate && _endDate) {
      return `${_startDate.format("DD.MM.YYYY")} - ${_endDate.format(
        "DD.MM.YYYY"
      )}`;
    }
    if (_startDate.isSame(_endDate)) {
      return _startDate.format("DD.MM.YYYY");
    }
    return "";
  };

  return (
    <MuiPickersUtilsProvider
      aria-describedby={id}
      libInstance={moment}
      utils={MomentUtils}
      locale={"ru"}
    >
      <TextField
        margin="dense"
        variant="outlined"
        value={renderPeriod()}
        className={className}
        InputProps={{
          contentEditable: false,
          endAdornment: (
            <IconButton onClick={handleClick} size="small">
              <DateRangeOutlined />
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
        <div>
          <KeyboardDatePicker
            label={"Больше"}
            value={startDate}
            {...dataInputOptions}
            onChange={(value) => setStartDate(value)}
            {...InputProps}
            margin="dense"
            autoOk
          />
          <KeyboardDatePicker
            label={"Меньше"}
            value={endDate}
            {...dataInputOptions}
            onChange={(value) => {
              setEndDate(
                value ? value.hours(23).minutes(59).seconds(59) : value
              );
            }}
            {...InputProps}
            margin="dense"
            autoOk
          />
        </div>
      </Popover>
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
