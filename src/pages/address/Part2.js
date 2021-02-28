import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import {
  BoolFilter,
  StringFilter,
} from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { getUserId } from "utils/user";
import { Part2HouseTable } from "./Part2HouseTable";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
  formWrapper: {
    flexDirection: "column",
    gap: theme.spacing(2),
    display: "flex",
  },
  innerContent: {
    flexDirection: "row",
    gap: theme.spacing(3),
    display: "flex",
  },
  selectedRow: {
    backgroundColor: "#0096005c",
  },
}));

export const Part2 = () => {
  const params = [getUserId()];

  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();

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

  return (
    <Switch>
      <Route path={`${match.path}/:streetId`}>
        <Part2HouseTable />
      </Route>
      <Route path={match.path}>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.table}>
            <div className={classes.innerContent}>
              <Table
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
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  );
};