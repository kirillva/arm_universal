import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import { runRpc } from "utils/rpc";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import MenuItem from "@material-ui/core/MenuItem";
// import Select from '@material-ui/core/Select';
import moment from "moment";
import MomentUtils from "@date-io/moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export const StringEditor = ({ fieldProps, ...props }) => {
  return <TextField {...props} />;
};

export const BoolEditor = ({ fieldProps, ...props }) => {
  return (
    <TextField select {...props} variant="outlined" margin="dense">
      <MenuItem value={true}>Да</MenuItem>
      <MenuItem value={false}>Нет</MenuItem>
    </TextField>
  );
};

export const DateEditor = ({
  fieldProps,
  value,
  name,
  label,
  setFieldValue,
}) => {
  const dataInputOptions = {
    variant: "inline",
    invalidDateMessage: "Некорректный формат даты",
    inputVariant: "outlined",
    format: "DD.MM.YYYY",
  };

  return (
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale={"ru"}
    >
      <KeyboardDatePicker
        {...dataInputOptions}
        label={label}
        value={value}
        onChange={(value) =>
          setFieldValue(name, value ? value.toISOString(true) : null)
        }
        margin="dense"
        autoOk
      />
    </MuiPickersUtilsProvider>
  );
};

export function SelectEditor({ fieldProps, value, ...rest }) {
  const { idProperty, nameProperty, table } = fieldProps;
  const [_value, _setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value) {
      setLoading(true);
      runRpc({
        action: table,
        method: "Query",
        data: [
          {
            limit: 1,
            select: [idProperty, nameProperty].filter((item) => item).join(","),
            filter: [{ property: idProperty, value }],
          },
        ],
        type: "rpc",
      }).then((responce) => {
        setLoading(false);
        _setValue(responce.result.records[0][nameProperty]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return !loading ? (
    <SelectEditorField
      {...rest}
      fieldProps={fieldProps}
      value={{ [idProperty]: value, [nameProperty]: _value }}
    />
  ) : (
    <CircularProgress />
  );
}

export function SelectEditorField({
  fieldProps,
  value,
  setFieldValue,
  name,
  label,
}) {
  const setFilter = (newValue) => {
    setFieldValue(name, newValue);
  };

  const {
    idProperty,
    nameProperty,
    table,
    params,
    filter: propFilter,
    method = "Query",
    sortBy,
    error,
    helperText,
  } = fieldProps;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const onChange = (event, newValue) => {
    if (newValue) {
      setFilter(newValue[idProperty]);
    } else {
      setFilter(null);
    }
  };

  const onInputChange = (event, newInputValue, reason) => {
    if (reason === "reset") {
      setInputValue("");
    } else {
      setInputValue(newInputValue);
    }
  };

  const loadData = () => {
    if (open) {
      let filter = [];

      if (nameProperty && inputValue) {
        filter.push({
          property: nameProperty,
          value: inputValue,
          operator: "like",
        });
      }
      if (propFilter) {
        filter = filter.concat(propFilter);
      }
      const rpcData = {
        limit: 50,
        select: [idProperty, nameProperty, sortBy]
          .filter((item) => item)
          .join(","),
        filter: filter,
      };
      if (params) {
        rpcData.params = params;
      }
      if (sortBy) {
        rpcData.sort = [
          {
            property: sortBy,
            direction: "ASC",
          },
        ];
      }
      setLoading(true);
      runRpc({
        action: table,
        method: method,
        data: [rpcData],
        type: "rpc",
      }).then((responce) => {
        setLoading(false);
        setOptions(responce.result.records);
      });
    } else {
      setLoading(false);
      setOptions([]);
    }
  };

  const onInputChangeDebounce = _.debounce(onInputChange, 1000);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, inputValue]);

  return (
    <Autocomplete
      noOptionsText="Нет данных"
      loadingText="Загрузка..."
      open={open}
      onOpen={() => {
        setOptions([]);
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) =>
        option[idProperty] === value[idProperty]
      }
      defaultValue={value}
      getOptionLabel={(option) => option[nameProperty]}
      options={options}
      loading={loading}
      onInputChange={onInputChangeDebounce}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          error={error}
          helperText={helperText}
          label={label}
          {...params}
          variant="outlined"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            endAdornment: params.InputProps.endAdornment,
          }}
        />
      )}
    />
  );
}