import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, Operators, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { getUserId } from "utils/user";
import { Part3HouseTable } from "./Part3HouseTable";
import { AddStreet } from "./cards/AddStreet";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Drawer } from "@material-ui/core";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  table: {
    flex: 1,
  },
  drawer: {
    minWidth: 300,
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
  formWrapper: {
    flexDirection: "column",
    gap: theme.spacing(2),
    display: "flex",
  },
  selectedRow: {
    backgroundColor: "#0096005c",
  },
}));

export const Part3StreetTable = () => {
  const [params, setParams] = useState([getUserId()]);
  const [open, setOpen] = useState(false);

  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();

  const cs_street = React.useMemo(
    () => [
      {
        title: "Тип",
        accessor: "c_short_type",
        operator: Operators.string,
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
        operator: Operators.string,
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
        operator: Operators.bool
      },
    ],
    []
  );

  return (
    <Switch>
      <Route path={`${match.path}/:streetId`}>
        <Part3HouseTable />
      </Route>
      <Route path={match.path}>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Drawer
            PaperProps={{
              className: classes.drawer,
            }}
            anchor="right"
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <AddStreet
              refreshPage={() => {
                setParams([getUserId()]);
                setOpen(false);
              }}
            />
          </Drawer>
          <Table
            className={classes.table}
            buttons={
              <>
                <Button
                  title={"Фильтры"}
                  className={classes.iconButton}
                  color={"black"}
                  onClick={() => setOpen(true)}
                >
                  <Add />
                </Button>
              </>
            }
            sortBy={[
              {
                id: "c_name",
                desc: false,
              },
            ]}
            title={"Улицы"}
            handleClick={(cell, row) => history.push(`/${match.path}/${row.id}`)}
            method="Select"
            params={params}
            columns={cs_street}
            getRowClassName={(row) =>
              row.original.b_finish ? classes.selectedRow : ""
            }
            action="cf_bss_cs_street"
          />
        </div>
      </Route>
    </Switch>
  );
};
