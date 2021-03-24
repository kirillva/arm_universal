import React, { useEffect, useMemo, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { Operators, StringFilter } from "components/table/Filters";
import { StringCell } from "components/table/Cell";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getItem, getUserId } from "utils/user";
import { getDivisionByLogin, getSelectByColumns } from "utils/helpers";
import CheckIcon from "@material-ui/icons/Check";
import { runRpc } from "utils/rpc";
import { MenuItem, TextField } from "@material-ui/core";
import { useSelectEditor } from "components/table/Editors";

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
    marginTop: theme.spacing(1),
    flex: 1,
  },
}));

export const VotersAssignList = ({ state, setState }) => {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = getUserId();

  const { reload: reloadUsers, component: usersComponent } = useSelectEditor({
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

  return (
    <>
      {usersComponent}

      <Table
        state={state}
        setState={setState}
        className={classes.table}
        title={"Избиратели"}
        method="Query"
        columns={cs_appartament}
        filter={[
          login == "nov"
            ? {
                id: "f_house___f_street___f_main_division",
                value: getDivisionByLogin(login),
              }
            : {
                id: "sd_subdivisions.f_division",
                value: getDivisionByLogin(login),
              },
        ]}
        sortBy={[
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
        ]}
        select={`id,${getSelectByColumns(
          cs_appartament
        )},n_number,f_house___n_number,f_house___f_subdivision,f_house___f_street___f_main_division,f_house___f_subdivision___f_division,f_house___f_street,f_house,f_house___f_street___c_short_type,f_house___f_street___c_name`}
        selectable
        actionButtons={[
          {
            icon: <CheckIcon />,
            title: "Назначить пользователя",
            handler: (ids) => {
              console.log(ids);

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
        ]}
        // params={[getUserId(), null, null]}
        action="cs_appartament"
      />
    </>
  );
};
