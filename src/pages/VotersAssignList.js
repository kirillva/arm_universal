import React, { useCallback, useMemo, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Operators, StringFilter } from "components/table/Filters";
import { StringCell } from "components/table/Cell";
import { getItem, getUserId } from "utils/user";
import { getDivisionByLogin, getSelectByColumns } from "utils/helpers";
import CheckIcon from "@material-ui/icons/Check";
import { runRpc } from "utils/rpc";
import { useSelectEditor } from "components/table/Editors";
import { Box, Paper, TextField, Typography } from "@material-ui/core";
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
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(2),
  },
  filterPaper: {
    flex: 1,
    padding: theme.spacing(2),
  },
  filterTitle: {
    marginBottom: theme.spacing(1),
  },
}));

export const VotersAssignList = ({ state, setState }) => {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = getUserId();

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
        accessor: "f_house___f_street___c_name",
        operator: Operators.string,
        Cell: ({ cell }) => {
          const {
            f_house___f_street___c_short_type,
            f_house___f_street___c_name,
          } = cell.row.original;
          return `${f_house___f_street___c_short_type} ${f_house___f_street___c_name}`;
        },
      },
      {
        title: "Номер дома",
        accessor: "f_house___c_full_number",
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
      {
        title: "Пользователь",
        accessor: "f_user___c_login",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
    ],
    []
  );

  const login = getItem("login");

  const globalFilters = useMemo(
    () => [
      login === "nov"
        ? {
            property: "f_house___f_street___f_main_division",
            value: getDivisionByLogin(login),
          }
        : {
            property: "sd_subdivisions.f_division",
            value: getDivisionByLogin(login),
          },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableComponent = useTableComponent({
    state: state,
    setState: setState,
    className: classes.table,
    title: "Избиратели",
    method: "Query",
    columns: cs_appartament,
    globalFilters: globalFilters,
    sortBy: [
      {
        id: "f_house___f_street___c_name",
        desc: false,
      },
      {
        id: "f_house___n_number",
        desc: false,
      },
      {
        id: "n_number",
        desc: false,
      },
    ],
    select: `id,${getSelectByColumns(
      cs_appartament
    )},n_number,f_house___n_number,f_house___f_subdivision,f_house___f_street___f_main_division,f_house___f_subdivision___f_division,f_house___f_street,f_house,f_house___f_street___c_short_type,f_house___f_street___c_name`,
    selectable: true,
    actionButtons: [
      {
        icon: <CheckIcon />,
        title: "Назначить пользователя",
        handler: (ids) => {
          runRpc({
            action: "cs_appartament",
            method: "Update",
            data: [
              Object.keys(ids)
                .filter((key) => ids[key])
                .map((item) => ({ id: item, f_user: selectedUser })),
            ],
            type: "rpc",
          });
        },
      },
    ],
    action: "cs_appartament",
  });

  return (
    <>
      {/* <Box className={classes.filterWrapper}>
        <Paper className={classes.filterPaper}>
          <Typography className={classes.filterTitle}>Фильтрация</Typography>
          <TextField variant={'outlined'} margin={'none'} size={'small'} fullWidth />
          <TextField variant={'outlined'} margin={'none'} size={'small'} fullWidth />
        </Paper>
        <Paper className={classes.filterPaper}>
          <Typography className={classes.filterTitle}>Назначение</Typography>

        </Paper>
      </Box> */}
      {usersComponent}
      {tableComponent.table}
    </>
  );
};
