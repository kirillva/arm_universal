import React, { useMemo, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { Operators, StringFilter } from "components/table/Filters";
import { StringCell } from "components/table/Cell";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getUserId } from "utils/user";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  drawer: {
    width: 500,
  },
  table: {
    flex: 1,
  },
}));

export const VotersList = ({
  state,
  setState,
  // setHouse,
  // setStreet,
  // setAppartment,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();

  const cs_appartament = useMemo(
    () => [
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "c_name",
        operator: Operators.string,
        Cell: ({ cell }) => {
          const { c_short_type, c_name } = cell.row.original;
          return `${c_short_type} ${c_name}`;
        },
      },
      {
        title: "Номер дома",
        accessor: "c_full_number",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Номер квартиры",
        accessor: "c_number",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
    ],
    []
  );

  return (
    <Table
      state={state}
      setState={setState}
      className={classes.table}
      title={"Избиратели"}
      method="Select"
      columns={cs_appartament}
      handleClick={(cell, row) => {
        const { f_house, f_street, id } = row.original;
        // setHouse(f_house);
        // setStreet(f_street);
        // setAppartment(id);
        history.push(`${match.path}/search?house=${f_house}&street=${f_street}&appartment=${id}`);
      }}
      params={[getUserId(), null, null]}
      action="cf_bss_cs_appartament"
    />
  );
};
