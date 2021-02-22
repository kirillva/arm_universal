import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import { runRpc } from "utils/rpc";
// import { makeStyles } from "@material-ui/styles";

// const useStyles = makeStyles((theme) => ({
//   field: {
//     minWidth: "200px",
//   },
// }));

export function SelectFilter({
  column: { filterValue, setFilter },
  className,
  idProperty = "",
  nameProperty = "",
  table = "",
  hidden,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const [inputValue, setInputValue] = useState("");

  // const classes = useStyles();

  const onChange = (event, newValue) => {
    if (newValue) {
      setFilter({ value: newValue[idProperty], operator: "=" });
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

  const onInputChangeDebounce = _.debounce(onInputChange, 1000);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, inputValue]);

  return (
    <Autocomplete
      hidden={hidden}
      className={className}
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
      getOptionLabel={(option) => option[nameProperty]}
      options={options}
      loading={loading}
      onInputChange={onInputChangeDebounce}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          fullWidth
          {...params}
          variant="outlined"
          margin="none"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: params.InputProps.endAdornment,
          }}
        />
      )}
    />
  );
}
