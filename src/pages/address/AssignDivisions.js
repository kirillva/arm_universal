import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { getDivisionByLogin } from "utils/helpers";
import { useTableComponent } from "components/table/useTableComponent";
import {
  NumberFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import { NumberCell, StringCell } from "components/table/Cell";
import { getItem, getUserId } from "utils/user";
import { Button } from "@material-ui/core";
import {
  assignDivisionToHouse,
  assignApproveDivisionToHouse,
} from "./AssignDivisionsHelper";
import { getUsers } from "utils/getUsers";

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
  button: {
    marginBottom: theme.spacing(2),
  },
}));

export const AssignDivisions = () => {
  const classes = useStyles();
  const [users, setUsers] = useState(null);
  // const [state, setState] = useState(null);
  const { ShowAcceptWindow } = useMessageContext();

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
        operator: Operators.string,
        style: {
          width: "120px",
        },
        Filter: NumberFilter,
        Cell: NumberCell,
      },
      {
        title: "Округ Госсовета",
        accessor: "n_gos_subdivision",
        operator: Operators.string,
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

  const login = getItem("login");

  const globalFilters = useMemo(
    () => [
      login === "nov"
        ? {
            property: "f_main_division",
            value: getDivisionByLogin(login),
          }
        : {
            property: "f_division",
            value: getDivisionByLogin(login),
          },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const params = useMemo(
    () => [null],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableComponent = useTableComponent({
    // state: state,
    // setState: setState,
    className: classes.table,
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

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Button
        className={classes.button}
        disabled={!(users && users.length)}
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
                      });
                    },
                  },
                  { text: "Нет", color: "primary" },
                ],
              });
            } else {
              tableComponent.loadData();
            }
          });
        }}
        variant="contained"
        color="primary"
      >
        Сохранить с округом Госсовета{" "}
        {users && users.length && users[0].division
          ? `(${users[0].division.n_gos_subdivision})` || "(Не указан)"
          : ""}
      </Button>
      <Switch>
        <Route path={match.path}>{tableComponent.table}</Route>
      </Switch>
    </div>
  );
};
