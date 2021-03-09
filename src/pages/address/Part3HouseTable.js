import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import {
  BoolFilter,
  NumberFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import { SelectCell, StringCell } from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { SelectEditor } from "components/table/Editors";
import { HouseDetail } from "./HouseDetail";
import { EditStreet } from "./cards/EditStreet";
import { AddHouse } from "./cards/AddHouse";
import { Button, Drawer, Paper, Typography } from "@material-ui/core";
import { runRpc } from "utils/rpc";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { ArrowBack } from "@material-ui/icons";
import { getSelectByColumns } from "utils/helpers";

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
    height: '100%'
  },
  streetWrapper: {
    display: "flex",
    padding: theme.spacing(2),
    height: '64px'
  },
  button: {
    margin: "auto 0 auto auto",
  },
  drawer: {
    minWidth: 300,
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
  selectedRow: {
    backgroundColor: "#0096005c",
  },
  flexGrow: {
    flex: 1,
  },
  backButton: {
    width: "120px",
  },
}));

export const Part3HouseTable = () => {
  const classes = useStyles();
  const { streetId } = useParams();
  // const [params, setParams] = useState([null, streetId, null]);
  const [street, setStreet] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();
  const [tableFilter, setTableFilter] = useState([{
    id: 'f_street',
    value: streetId
  }]);

  const cs_house = React.useMemo(
    () => [
      {
        title: "УИК",
        Filter: NumberFilter,
        Cell: StringCell,
        accessor: "n_uik",
        operator: Operators.number,
        style: {
          width: "80px",
        },
      },
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "f_street___c_name",
        operator: Operators.string,
        Cell: ({ cell }) => {
          const { f_street___c_short_type, f_street___c_name } = cell.row.original;
          return `${f_street___c_short_type} ${f_street___c_name}`;
        },
      },
      {
        title: "Округ ЧГСД",
        accessor: "f_subdivision",
        operator: Operators.number,
        mapAccessor: "f_subdivision___c_name",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "sd_subdivisions",
        },
        Filter: SelectFilter,
        Editor: SelectEditor,
        Cell: SelectCell,
        style: {
          width: "120px",
        },
      },
      {
        title: "Номер дома",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_full_number",
        operator: Operators.string,
        style: {
          width: "120px",
        },
      },
      {
        title: "Подтверждено",
        Filter: BoolFilter,
        Cell: ({ cell }) => {
          if (cell.value === null) return "";
          if (cell.value === true) return "Да";
          if (cell.value === false) return "Нет";
        },
        accessor: "b_check",
        operator: Operators.bool,
        style: {
          width: "120px",
        },
      },
      // {
      //   title: "Завершено",
      //   Filter: BoolFilter,
      //   Cell: ({ cell }) => {
      //     if (cell.value === null) return "";
      //     if (cell.value === true) return "Да";
      //     if (cell.value === false) return "Нет";
      //   },
      //   accessor: "b_finish",
      //   style: {
      //     width: "120px",
      //   },
      // },
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
    streetId && loadData(streetId).then((record) => setStreet(record));
  }, [streetId]);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.innerContent}>
        <Switch>
          <Route path={`${match.path}/edit`}>
            <Drawer
              PaperProps={{
                className: classes.drawer,
              }}
              anchor={"right"}
              open={true}
              onClose={() => {
                history.push(`${match.url}`);
              }}
            >
              <EditStreet
                street={street}
                id={streetId}
                refreshPage={() => {
                  setTableFilter([...tableFilter]);
                  loadData(streetId).then((record) => setStreet(record));
                  history.push(`${match.path.replace(':streetId', streetId)}`)
                }}
              />
            </Drawer>
          </Route>
          <Route path={`${match.path}/add`}>
            <Drawer
              PaperProps={{
                className: classes.drawer,
              }}
              anchor={"right"}
              open={true}
              onClose={() => {
                history.push(`${match.url}`);
              }}
            >
              <AddHouse
                street={streetId}
                refreshPage={() => {
                  setTableFilter([...tableFilter]);
                  history.push(`${match.url}`);
                }}
              />
            </Drawer>
          </Route>
          <Route path={`${match.path}/:houseId`}>
            <Drawer
              PaperProps={{
                className: classes.drawer,
              }}
              anchor={"right"}
              open={true}
              onClose={() => {
                history.push(`${match.url}`);
              }}
            >
              <HouseDetail
                addNew={true}
                refreshTable={() => {
                  setTableFilter([...tableFilter]);
                  history.push(`${match.url}`);
                }}
                street={streetId}
                // selectedHouse={selectedHouse}
                // setSelectedHouse={setSelectedHouse}
              />
            </Drawer>
          </Route>
        </Switch>
        {/* <Button
          className={classes.backButton}
          color="primary"
          variant="contained"
          onClick={() => history.push(`/part3edit`)}
        >
          <ArrowBack />
          Назад
        </Button> */}
        <Paper className={classes.streetWrapper}>
          <Typography variant="h6">
            {street ? `${street.c_short_type} ${street.c_name}` : " "}
          </Typography>
          <div className={classes.flexGrow} />
          <Button
            className={classes.button}
            onClick={() => {
              history.push(`${match.url}/add`);
            }}
          >
            <AddIcon />
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              // setDrawerState(EDIT_STREET);
              history.push(`${match.url}/edit`);
            }}
          >
            <EditIcon />
          </Button>
        </Paper>
        <Table
          className={classes.table}
          sortBy={[
            {
              id: "n_number",
              desc: false,
            },
          ]}
          filter={tableFilter}
          title={"Дома"}
          method="Query"
          columns={cs_house}
          getRowClassName={(row) =>
            row.original.b_finish ? classes.selectedRow : ""
          }
          select={`${getSelectByColumns(cs_house)},f_street___c_short_type,id`}
          handleClick={(cell, row) => {
            history.push(`${match.url}/${row.original.id}`);
          }}
          action="cs_house"
        />
      </div>
    </div>
  );
};
