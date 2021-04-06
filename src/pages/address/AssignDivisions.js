import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useTableComponent } from "components/table/useTableComponent";
import {
  NumberFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import { NumberCell, StringCell } from "components/table/Cell";
import { getUserId } from "utils/user";
import { Button, FormControlLabel } from "@material-ui/core";
import {
  assignDivisionToHouse,
  assignApproveDivisionToHouse,
} from "./AssignDivisionsHelper";
import { getUsers } from "utils/getUsers";
import SwitchIcon from "@material-ui/core/Switch";

import { useMessageContext } from "context/MessageContext";

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
  selectColumn: {
    width: 250,
  },
  drawer: {
    minWidth: 300,
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

export const AssignDivisions = () => {
  const classes = useStyles();
  const [users, setUsers] = useState(null);
  // const [state, setState] = useState(null);
  const { ShowAcceptWindow } = useMessageContext();
  const [checked, setChecked] = useState(null);

  const match = useRouteMatch();
  const cs_appartament = useMemo(
    () => [
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "c_street",
        operator: Operators.string,
        Cell: ({ cell }) => {
          const { c_street_type, c_street } = cell.row.original;
          return `${c_street_type} ${c_street}`;
        },
      },
      {
        title: "Номер дома",
        accessor: "c_house_number",
        operator: Operators.string,
        style: {
          width: "120px",
        },
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Количество квартир",
        accessor: "n_total_appartament",
        operator: Operators.number,
        style: {
          width: "120px",
        },
        Filter: NumberFilter,
        Cell: NumberCell,
      },
      {
        title: "УИК",
        accessor: "n_uik",
        operator: Operators.number,
        style: {
          width: "120px",
        },
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Округ Госсовета",
        accessor: "n_gos_subdivision",
        operator: Operators.number,
        style: {
          width: "120px",
        },
        Filter: NumberFilter,
        Cell: NumberCell,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // const login = getItem("login");

  const usersLoaded = users && users.length;

  const globalFilters = useMemo(
    () =>
      [
        usersLoaded
          ? {
              property: "f_division",
              value: users[0].division.f_division,
            }
          : null,
        {
          property: "n_gos_subdivision",
          value: null,
          operator: checked ? "isnot" : "is",
        },
      ].filter((item) => item),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, usersLoaded, checked]
  );

  const params = useMemo(
    () => [null],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableComponent = useTableComponent({
    className: classes.table,
    allowLoad: usersLoaded,
    title: "Дома",
    method: "Select",
    columns: cs_appartament,
    globalFilters: globalFilters,
    idProperty: "f_house",
    params,
    selectable: true,
    action: "cf_bss_cs_house",
  });

  useEffect(() => {
    getUsers(getUserId()).then((_users) => setUsers(_users));
  }, []);

  const isRowsSelected = Object.keys(tableComponent.selectedRowIds).length > 0;

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.buttons}>
        <Button
          className={classes.button}
          disabled={!(users && users.length) || !isRowsSelected}
          onClick={() => {
            assignDivisionToHouse(
              tableComponent.selectedRowIds,
              users[0].division.n_gos_subdivision
            ).then((response) => {
              const { houseWithGos } = response;
              if (houseWithGos && houseWithGos.length) {
                ShowAcceptWindow({
                  title: "Предупреждение",
                  components: `Вы действительно хотите задать округа? Дома ${houseWithGos
                    .map((item) => item.c_house_number)
                    .join(", ")} уже имеют округ`,
                  buttons: [
                    {
                      text: "Да",
                      color: "secondary",
                      handler: () => {
                        assignApproveDivisionToHouse(
                          houseWithGos,
                          users[0].division.n_gos_subdivision
                        ).then((response) => {
                          tableComponent.loadData();
                          tableComponent.handleUnselectAll(false);
                        });
                      },
                    },
                    {
                      text: "Нет",
                      color: "primary",
                      handler: () => {
                        tableComponent.loadData();
                        // tableComponent.toggleAllRowsSelected(false);
                      },
                    },
                  ],
                });
              } else {
                tableComponent.loadData();
                tableComponent.handleUnselectAll(false);
              }
            });
          }}
          variant="contained"
          color="primary"
        >
          Сохранить с округом Госсовета{" "}
          {users && users.length && users[0].division
            ? `(${users[0].division.n_gos_subdivision || "Не указан"})`
            : ""}
        </Button>
        <Button
          className={classes.button}
          disabled={!(users && users.length) || !isRowsSelected}
          onClick={() => {
            assignDivisionToHouse(tableComponent.selectedRowIds, null).then(
              (response) => {
                const { houseWithGos } = response;
                if (houseWithGos && houseWithGos.length) {
                  assignApproveDivisionToHouse(houseWithGos, null).then(
                    (response) => {
                      tableComponent.loadData();
                      tableComponent.handleUnselectAll(false);
                    }
                  );
                }
              }
            );
          }}
          variant="contained"
          color="primary"
        >
          Отвязать от округа
        </Button>
        <FormControlLabel
          control={
            <SwitchIcon
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              color="primary"
            />
          }
          label="Показать непривязанные/привязанные"
        />
      </div>
      <Switch>
        <Route path={match.path}>{tableComponent.table}</Route>
      </Switch>
    </div>
  );
};
