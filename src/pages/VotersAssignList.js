import React, { useCallback, useMemo, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import {
  FromToFilter,
  NumberFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import { NumberCell, StringCell } from "components/table/Cell";
import { getItem, getUserId } from "utils/user";
import { getDivisionByLogin, getSelectByColumns } from "utils/helpers";
import CheckIcon from "@material-ui/icons/Check";
import { runRpc } from "utils/rpc";
import { useSelectEditor } from "components/table/Editors";
import { Box, Button, Paper, TextField, Typography } from "@material-ui/core";
import { useTableComponent } from "components/table/useTableComponent";

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
    marginTop: theme.spacing(2),
    flex: 1,
  },
  filterWrapper: {
    width: "200px",
    display: "flex",
    gap: theme.spacing(2),
  },
  selectedRow: {
    backgroundColor: "#e0e0e0",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  inputsWrapper: {
    display: "flex",
    width: "100%",
    gap: theme.spacing(2),
  },
}));

export const VotersAssignList2 = () => {
  console.log("VotersAssignList", VotersAssignList);
  return null;
};

export const VotersAssignList = () => {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const userId = getUserId();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { component: usersComponent } = useSelectEditor({
    name: "f_user",
    fieldProps: {
      params: [userId],
      margin: "none",
      size: "small",
      idProperty: "id",
      nameProperty: "c_login",
      table: "cf_bss_pd_users",
    },
    label: "Пользователь",
    value: selectedUser,
    setFieldValue: (name, value) => setSelectedUser(value),
  });

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
        title: "Назначение",
        accessor: "jb_info",
        mapAccessor: "n_total_appartament",
        operator: Operators.string,
        Filter: () => null,
        getTitle: (original) => {
          if (original.jb_info) {
            return original.jb_info.map((item) => {
              const { f_user, n_min_number, n_max_number, n_count } = item;
              return `${
                f_user || ""
              } ${n_min_number}-${n_max_number} (${n_count})`;
            }).join(', ');
          }
          return "";
        },
        Cell: ({ cell, ...props }) => {
          const value = cell.value;
          if (value) {
            return value.map((item) => {
              const { f_user, n_min_number, n_max_number, n_count } = item;
              return `${
                f_user || ""
              } ${n_min_number}-${n_max_number} (${n_count})`;
            }).join(', ');
          }
          return "";
        },
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
      // f_main_division
      // f_division
      // f_subdivision
      // c_subdivision
      // n_uik
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
    title: "Избиратели",
    method: "Select",
    columns: cs_appartament,
    globalFilters: globalFilters,
    idProperty: "f_house",
    params,
    selectable: false,
    handleClick: (cell, row) => {
      setSelectedRow(row);
    },
    getRowClassName: (row) => {
      if (selectedRow && selectedRow.id === row.id) {
        return classes.selectedRow;
      } else {
        return "";
      }
    },
    action: "cf_bss_cs_house",
  });

  return (
    <>
      {usersComponent}
      <div className={classes.inputsWrapper}>
        <TextField
          inputProps={{
            min: 0,
          }}
          margin="dense"
          label="С"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          variant="outlined"
        />
        <TextField
          inputProps={{
            max: 10,
          }}
          margin="dense"
          label="По"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          variant="outlined"
        />
      </div>
      <Button
        onClick={() => {
          runRpc({
            action: "cs_appartament",
            method: "Query",
            data: [
              {
                limit: 10000,
                filter: [
                  { property: "f_house", value: selectedRow.id, operator: "=" },
                  { property: "n_number", value: from, operator: ">=" },
                  { property: "n_number", value: to, operator: "<=" },
                ],
              },
            ],
            type: "rpc",
          }).then((response) => {
            const records = response.result.records;

            runRpc({
              action: "cs_appartament",
              method: "Update",
              data: [
                records.map((item) => ({ id: item.id, f_user: selectedUser })),
              ],
              type: "rpc",
            }).then(() => tableComponent.loadData());
          });
        }}
        disabled={!selectedRow || !selectedUser || tableComponent.loading}
        className={classes.button}
        variant={"contained"}
        color={"primary"}
      >
        Назначить пользователя
      </Button>
      {tableComponent.table}
    </>
  );
};
