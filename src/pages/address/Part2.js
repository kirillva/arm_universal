import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { getItem, getUserId } from "utils/user";
import { Part2HouseTable } from "./Part2HouseTable";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { SelectUik } from "components/SelectUik";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  drawer: {
    minWidth: 300,
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
  table: {
    flex: 1,
  },
  formWrapper: {
    flexDirection: "column",
    gap: theme.spacing(2),
    display: "flex",
  },
  selectedRow: {
    backgroundColor: "#0096005c",
  },
  selectUik: {
    maxWidth: "200px",
  },
}));

export const Part2 = () => {
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
  const [uik, setUik] = useState(null);
  const [state, setState] = useState(null);

  const login = getItem("login");
  let division = null;
  switch (login) {
    case "kalinin":
      division = 1;
      break;
    case "lenin":
      division = 7;
      break;
    case "moscow":
      division = 8;
      break;
    default:
      break;
  }

  const params = [getUserId(), uik];
  const cs_street = React.useMemo(
    () => [
      {
        title: "Тип",
        accessor: "c_short_type",
        style: {
          width: "80px",
        },
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "c_name",
        Cell: StringCell,
      },
      {
        title: "Завершен",
        Filter: BoolFilter,
        Cell: BoolCell,
        style: {
          width: "80px",
        },
        accessor: "b_finish",
      },
    ],
    []
  );

  const StreetsTable = useMemo(
    () => (
      <Table
        state={state}
        setState={setState}
        className={classes.table}
        sortBy={[
          {
            id: "c_name",
            desc: false,
          },
        ]}
        title={"Улицы"}
        handleClick={(cell, row) => history.push(`/part2/${row.id}`)}
        method="Select"
        params={params}
        columns={cs_street}
        getRowClassName={(row) =>
          row.original.b_finish ? classes.selectedRow : ""
        }
        action="cf_bss_cs_street"
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params]
  );

  return (
    <Switch>
      <Route path={`${match.path}/:streetId`}>
        <Part2HouseTable uik={uik} />
      </Route>
      <Route path={match.path}>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <SelectUik
            margin="dense"
            size="small"
            name="n_uik"
            division={division}
            value={uik}
            className={classes.selectUik}
            handleChange={(e) => setUik(e.target.value)}
          />
          {StreetsTable}
        </div>
      </Route>
    </Switch>
  );
};
