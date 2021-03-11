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
import useDebounce from "components/hooks/useDebounce";

export const StringEditor = ({ fieldProps, ...props }) => {
  return <TextField {...props} />;
};

export const BoolEditor = ({ fieldProps, ...props }) => {
  const { margin, size } = fieldProps || {};
  return (
    <TextField
      margin={margin || "dense"}
      size={size || "small"}
      select
      {...props}
      variant="outlined"
    >
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

export const useSelectEditor = ({
  fieldProps,
  value,
  setFieldValue,
  name,
  ...rest
}) => {
  const { idProperty, nameProperty, table } = fieldProps;
  const [inputValue, _setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  value = value ? String(value) : null;

  const setInputValue = (_value) => {
    _setInputValue(_value ? String(_value) : "");
  };

  const loadInputValue = (_value = null) => {
    if (_value !== null) value = _value;
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
        setInputValue(responce.result.records[0][nameProperty]);
      });
    } else {
      setInputValue('');
    }
  }

  useEffect(() => {
    if (value && !inputValue) {
      loadInputValue();  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputValue]);

  return {
    reload: loadInputValue,
    component: !loading ? (
      <SelectEditorField
        {...rest}
        fieldProps={fieldProps}
        value={{ [nameProperty]: inputValue, [idProperty]: value }}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setValue={(_value) => {
          if (_value) {
            setFieldValue(name, _value[idProperty]);
          } else {
            setFieldValue(name, null);
          }
        }}
      />
    ) : (
      <CircularProgress />
    )
  }
}

export function SelectEditor({
  fieldProps,
  value,
  setFieldValue,
  name,
  ...rest
}) {
  const { idProperty, nameProperty, table } = fieldProps;
  const [inputValue, _setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  value = value ? String(value) : null;

  const setInputValue = (_value) => {
    _setInputValue(_value ? String(_value) : "");
  };

  useEffect(() => {
    if (value && !inputValue) {
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
        setInputValue(responce.result.records[0][nameProperty]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputValue]);

  return !loading ? (
    <SelectEditorField
      {...rest}
      fieldProps={fieldProps}
      value={{ [nameProperty]: inputValue, [idProperty]: value }}
      inputValue={inputValue}
      setInputValue={setInputValue}
      setValue={(_value) => {
        if (_value) {
          setFieldValue(name, _value[idProperty]);
        } else {
          setFieldValue(name, null);
        }
      }}
    />
  ) : (
    <CircularProgress />
  );
}

export function SelectEditorField({
  fieldProps,
  value,
  inputValue,
  setValue,
  setInputValue,
  label,
  className
}) {
  const {
    idProperty,
    nameProperty,
    table,
    params,
    method = "Query",
    sortBy,
    error,
    helperText,
    margin,
    size,
    operator,
    filter: initialFilter,
  } = fieldProps;

  const deferredInputValue = useDebounce(inputValue, 1000);

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const loadData = () => {
    let filter = [];
    setOptions([]);
    if (initialFilter) {
      filter = filter.concat(initialFilter);
    }
    if (nameProperty && inputValue) {
      filter.push({
        property: nameProperty,
        value: inputValue,
        operator: operator || "like",
      });
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
      setOptions(
        responce.result.records.map((item) => {
          return {
            [idProperty]: String(item[idProperty]),
            [nameProperty]:
              String(item[nameProperty]) || String(item[idProperty]),
          };
        }) || []
      );
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredInputValue]);

  const onChange = (event, newValue) => {
    if (newValue) {
      setValue(newValue);
      setInputValue(newValue[nameProperty]);
    } else {
      setValue(null);
      setInputValue("");
      setOptions([]);
    }
  };

  const onInputChange = (event, newInputValue, reason) => {
    setLoading(true);
    setOptions([]);
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      fullWidth
      className={className}
      noOptionsText="Нет данных"
      loadingText="Загрузка..."
      getOptionSelected={(option, value) =>
        option[idProperty] === value[idProperty]
      }
      inputValue={inputValue}
      value={value}
      getOptionLabel={(option) => {
        return option[nameProperty] || "";
      }}
      options={options}
      loading={loading}
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          fullWidth
          error={error}
          helperText={helperText}
          label={label}
          {...params}
          variant="outlined"
          margin={margin || "dense"}
          size={size || "small"}
          InputProps={{
            ...params.InputProps,
            endAdornment: params.InputProps.endAdornment,
          }}
        />
      )}
    />
  );
}
