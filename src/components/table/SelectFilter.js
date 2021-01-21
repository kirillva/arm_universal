import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import { runRpc } from "utils/rpc";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  field: {
    minWidth: "200px",
  },
}));

export function SelectFilter({
  column: { filterValue, setFilter },
  className,
  idProperty = "",
  nameProperty = "",
  table = "",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  // const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const classes = useStyles();

  // const loadData = (value) => {
  //   const filter = [];
  //   if (nameProperty) {
  //     filter.push({
  //       property: nameProperty,
  //       value: value,
  //       operator: "like",
  //     });
  //   }
  //   runRpc({
  //     action: table,
  //     method: "Query",
  //     data: [
  //       {
  //         limit: 50,
  //         select: [idProperty, nameProperty].filter((item) => item).join(","),
  //         filter: filter,
  //       },
  //     ],
  //     type: "rpc",
  //   }).then((responce) => {
  //     setLoading(false);
  //     setOptions(responce.result.records);
  //   });
  // };

  // const onChange = (e) => {
  //   const value = e.target.value;
  //   setLoading(false);
  //   setOptions([]);
  //   if (value) {
  //     setLoading(true);
  //     loadData(value)
  //   }
  // }

  const onChange = (event, newValue) => {
    if (newValue) {
      setFilter({value: newValue[idProperty], operator: '='});
    } else {
      setFilter(null);
    }
  }
  const onInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  }

  const onInputChangeDebounced = _.debounce(onInputChange, 1000);

  useEffect(() => {
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
  }, [open, inputValue, table]);

  return (
    <Autocomplete
      className={classes.field}
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
      // value={filterValue || ''}
      // inputValue={inputValue}
      onInputChange={(...props)=>{
        setLoading(true);
        onInputChangeDebounced(...props);
      }}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            endAdornment: params.InputProps.endAdornment
          }}
        />
      )}
    />
  );
}
