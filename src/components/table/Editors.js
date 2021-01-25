import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import { runRpc } from "utils/rpc";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const StringEditor = ({ ...props }) => {
  return <TextField {...props} />;
};

export function SelectEditor ({
  fieldProps,
  value,
  ...rest
}) {
  const { idProperty, nameProperty, table } = fieldProps
  const [_value, _setValue] = useState('');

  useEffect(() => {
    if (value) {
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
        _setValue(responce.result.records[0][nameProperty]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return _value ? <SelectEditorField {...rest} fieldProps={fieldProps} value={{[idProperty]: value, [nameProperty]: _value}} /> : null
}

export function SelectEditorField({
  fieldProps,
  value,
  setFieldValue,
  name,
  label
}) {
  const setFilter = (newValue) => {
    console.log('setFilter');
    setFieldValue(name, newValue);
  }

  const { idProperty, nameProperty, table } = fieldProps
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  
  const [inputValue, setInputValue] = useState('');

  const onChange = (event, newValue) => {
    if (newValue) {
      setFilter(newValue[idProperty]);
    } else {
      setFilter(null);
    }
  };

  const onInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const loadData = () => {
    if (open && inputValue) {
      const filter = [];
      if (nameProperty) {
        filter.push({
          property: nameProperty,
          value: inputValue,
          operator: "like",
        });
      }
      setLoading(true);
      runRpc({
        action: table,
        method: "Query",
        data: [
          {
            limit: 50,
            select: [idProperty, nameProperty].filter((item) => item).join(","),
            filter: filter,
          },
        ],
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

  const onInputChangeDebounce = _.debounce(onInputChange, 2000);

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
      value={value}
      getOptionLabel={(option) => option[nameProperty]}
      options={options}
      loading={loading}
      onInputChange={onInputChangeDebounce}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
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
