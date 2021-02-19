import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, StringFilter } from "components/table/Filters";
import { BoolCell, SelectCell, StringCell } from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { SelectEditor } from "components/table/Editors";
import { HouseDetail } from "./HouseDetail";
import { parse } from "query-string";
import { useLocation } from "react-router-dom";
import { EditStreet } from "./EditStreet";
import { AddHouse } from "./AddHouse";
import { Button, Drawer, Paper, Typography } from "@material-ui/core";
import { runRpc } from "utils/rpc";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    overflow: "auto",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  table: {
    flex: 1,
  },
  formWrapper: {
    flexDirection: "column",
    gap: theme.spacing(2),
    display: "flex",
  },
  innerContent: {
    flexDirection: "column",
    gap: theme.spacing(2),
    display: "flex",
  },
  streetWrapper: {
    display: "flex",
    padding: theme.spacing(2),
  },
  button: {
    margin: "auto 0 auto auto",
  },
}));

const EDIT_STREET = "EDIT_STREET";
const ADD_HOUSE = "ADD_HOUSE";
const EDIT_HOUSE = "EDIT_HOUSE";

export const StreetDetailTable = () => {
  const classes = useStyles();
  const location = useLocation();

  const { id } = parse(location.search);

  const [params, setParams] = useState([null, id]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [street, setStreet] = useState(null);
  const [open, setOpen] = useState(false);

  const [drawerState, setDrawerState] = useState(null);

  const cs_house = React.useMemo(
    () => [
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "c_name",
        Cell: ({ cell }) => {
          const { c_short_type, c_name } = cell.row.original;
          return `${c_short_type} ${c_name}`;
        },
      },
      {
        title: "Район",
        accessor: "f_subdivision",
        mapAccessor: "c_subdivision",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "sd_subdivisions",
        },
        Filter: SelectFilter,
        Editor: SelectEditor,
        Cell: SelectCell,
      },
      {
        title: "Номер дома",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_full_number",
      },
      {
        title: "Удалена",
        Filter: BoolFilter,
        Cell: BoolCell,
        accessor: "b_disabled",
      },
      {
        title: "Причина",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_disabled",
      },
      {
        title: "УИК",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "n_uik",
      },
      {
        title: "Автор",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_first_name",
      },
    ],
    []
  );

  const loadData = async (id) => {
    const responce = await runRpc({
      action: "cs_street",
      method: "Query",
      data: [
        {
          filter: [
            {
              property: "id",
              value: id,
              operator: "=",
            },
          ],
          limit: 1,
        },
      ],
      type: "rpc",
    });
    const street = responce.result.records[0];
    return street;
  };

  useEffect(() => {
    loadData(id).then((record) => setStreet(record));
  }, [id]);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.innerContent}>
        <Paper className={classes.streetWrapper}>
          <Typography variant="h6">
            Улица: {street ? street.c_name : ""}
          </Typography>
          <Button
            className={classes.button}
            onClick={() => {
              setDrawerState(ADD_HOUSE);
            }}
          >
            <AddIcon />
          </Button>
          <Button
            onClick={() => {
              setDrawerState(EDIT_STREET);
            }}
          >
            <EditIcon />
          </Button>
        </Paper>
        <Drawer
          anchor={"right"}
          open={Boolean(drawerState)}
          onClose={() => {
            setDrawerState(null);
          }}
        >
          {drawerState === EDIT_STREET && (
            <EditStreet
              street={street}
              id={id}
              loadData={loadData}
              refreshPage={() => setParams([...params])}
            />
          )}
          {drawerState === ADD_HOUSE && (
            <AddHouse street={id} refreshPage={() => setParams([...params])} />
          )}
          {drawerState === EDIT_HOUSE && (
            <HouseDetail
              refreshTable={() => setParams([...params])}
              street={id}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
            />
          )}
        </Drawer>
        <div className={classes.table}>
          <Table
            title={"Дома"}
            method="Select"
            columns={cs_house}
            handleClick={(cell, row) => {
              setSelectedHouse(row);
              setDrawerState(EDIT_HOUSE);
            }}
            params={params}
            action="cf_bss_cs_house"
          />
        </div>
      </div>
    </div>
  );
};
