import { MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getDivisionByLogin } from "utils/helpers";
import { runRpc } from "utils/rpc";
import { getItem } from "utils/user";

export const SelectSubdivision = ({
  value,
  error,
  handleChange,
  isSubmitting,
  margin = "dense",
  size = "medium",
  name,
}) => {
  const [subdivisions, setSubdivisions] = useState([]);
  const login = getItem("login");
 
  useEffect(() => {
    const division = getDivisionByLogin(login);
    const filter = [
      { property: "id", value: 0, operator: "gt" },
      {
        property: "b_city",
        value: login.indexOf("nov") >= 0,
        operator: "=",
      }
    ]
    if (division) {
      filter.push({
        property: "f_division",
        value: division,
        operator: "=",
      });
    }
    runRpc({
      action: "sd_subdivisions",
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "n_code", direction: "asc" }],
          filter,
        },
      ],
      type: "rpc",
    }).then((responce) => {
      setSubdivisions(responce.result.records);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TextField
      select
      margin={margin}
      size={size}
      label={login == "nov" ? "Округ НГСД" : "Округ ЧГСД"}
      name={name}
      value={value}
      error={error}
      helperText={error}
      onChange={handleChange}
      disabled={isSubmitting}
      variant="outlined"
    >
      <MenuItem value={null}>Не выбрано</MenuItem>
      {subdivisions.map((item) => (
        <MenuItem value={item.id}>{item.c_name}</MenuItem>
      ))}
    </TextField>
  );
};
