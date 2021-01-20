import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import _ from "lodash";
import { runRpc } from "utils/rpc";

export function SelectFilter({
  column: { filterValue, setFilter },
  className,
  table = "",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const loadData = () => {
    setOptions([]);
    setLoading(true);
  };

  const loadDataDebounced = _.debounce(loadData, 1000);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    runRpc({
      action: table,
      method: "Query",
      data: [
        {
          limit: 10000,
          select: 'id,c_name'
        },
      ],
      type: "rpc",
    }).then((responce) => {
      if (active) {
        setLoading(false);
        setOptions(responce.result.records);
      }
    });

    return () => {
      active = false;
    };
  }, [loading, table]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      noOptionsText="Нет данных"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.c_name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          onChange={loadDataDebounced}
          margin="dense"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
