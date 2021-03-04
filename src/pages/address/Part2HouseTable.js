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
import { getUserId } from "utils/user";

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

export const Part2HouseTable = ({ uik }) => {
  const classes = useStyles();
  const { streetId } = useParams();
  const [params, setParams] = useState([getUserId(), streetId, null]);
  const [street, setStreet] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();

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
        accessor: "c_name",
        operator: Operators.string,
        Cell: ({ cell }) => {
          const { c_short_type, c_name } = cell.row.original;
          return `${c_short_type} ${c_name}`;
        },
      },
      {
        title: "Округ ЧГСД",
        accessor: "f_subdivision",
        operator: Operators.number,
        mapAccessor: "c_subdivision",
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
      {
        title: "Завершено",
        Filter: BoolFilter,
        Cell: ({ cell }) => {
          if (cell.value === null) return "";
          if (cell.value === true) return "Да";
          if (cell.value === false) return "Нет";
        },
        accessor: "b_finish",
        operator: Operators.bool,
        style: {
          width: "120px",
        },
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
                history.push(`/part2/${streetId}`);
              }}
            >
              <EditStreet
                street={street}
                id={streetId}
                refreshPage={() => {
                  setParams([...params]);
                  loadData(streetId).then((record) => setStreet(record));
                  history.push(`/part2/${streetId}`);
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
                history.push(`/part2/${streetId}`);
              }}
            >
              <HouseDetail
                refreshTable={() => {
                  setParams([...params]);
                  history.push(`/part2/${streetId}`);
                }}
                street={streetId}
                // selectedHouse={selectedHouse}
                // setSelectedHouse={setSelectedHouse}
              />
            </Drawer>
          </Route>
        </Switch>
        <Button className={classes.backButton} color="primary" variant="contained" onClick={()=>history.push(`/part2`)}><ArrowBack />Назад</Button>
        <Paper className={classes.streetWrapper}>
          <Typography variant="h6">
            {street ? `${street.c_short_type} ${street.c_name}` : " "}
          </Typography>
        </Paper>
        <Table
          className={classes.table}
          filter={[{
            id: "n_uik",
            value: uik,
          }]}
          sortBy={[
            {
              id: "n_number",
              desc: false,
            },
          ]}
          title={"Дома"}
          method="Select"
          columns={cs_house}
          getRowClassName={(row) =>
            row.original.b_finish ? classes.selectedRow : ""
          }
          handleClick={(cell, row) => {
            history.push(`/part2/${streetId}/${row.original.id}`);
          }}
          params={params}
          action="cf_bss_cs_house"
        />
      </div>
    </div>
  );
};
