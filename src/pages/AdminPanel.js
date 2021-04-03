import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BoolFilter, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { useTableComponent } from "components/table/useTableComponent";
import { getDivisionByLogin, getSelectByColumns } from "utils/helpers";
import { getItem } from "utils/user";
import { runRpc } from "utils/rpc";
// import { SelectFilter } from "components/table/SelectFilter";
// import {
//   SelectEditor,
// } from "components/table/Editors";

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
}));

export const AdminPanel = () => {
  const classes = useStyles();

  const pd_userindivisions = React.useMemo(
    () => [
      //   {
      //     title: "f_parent",
      //     accessor: "f_parent",
      //     fieldProps: {
      //       idProperty: "id",
      //       nameProperty: "c_name",
      //       table: "pd_users",
      //     },
      //     Filter: SelectFilter,
      //     Editor: SelectEditor,
      //     Cell: StringCell,
      //   },
      {
        title: "Логин",
        accessor: "f_user___c_login",
        Filter: StringFilter,
        Cell: StringCell,
      },
      //   { accessor: "c_password", title: "c_password", Filter: StringFilter, Cell: StringCell },
      {
        title: "ФИО",
        accessor: "f_user___c_first_name",
        Filter: StringFilter,
        Cell: StringCell,
      },
      //   { accessor: "c_last_name", title: "c_last_name", Filter: StringFilter, Cell: StringCell },
      //   { accessor: "c_middle_name", title: "c_middle_name", Filter: StringFilter, Cell: StringCell },
      //   { accessor: "c_imei", title: "c_imei", Filter: StringFilter, Cell: StringCell },
      {
        title: "Описание",
        accessor: "f_user___c_description",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Удален",
        accessor: "f_user___b_disabled",
        Filter: BoolFilter,
        Cell: BoolCell,
        Editor: BoolEditor,
      },
      //   { title: "sn_delete", accessor: "sn_delete", Filter: BoolFilter, Cell: BoolCell },
      //   { title: "Версия", accessor: "c_version", Filter: StringFilter, Cell: StringCell },
      //   { title: "n_version", accessor: "n_version", Filter: StringFilter, Cell: StringCell },
      {
        title: "Телефон",
        accessor: "f_user___c_phone",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "e-mail",
        accessor: "f_user___c_email",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Округ Госсовета",
        accessor: "n_gos_subdivision",
        Filter: StringFilter,
        Cell: StringCell,
      },
    ],
    []
  );

  const login = getItem("login");

  const tableComponent = useTableComponent({
    className: classes.table,
    title: "Список пользователей",
    columns: pd_userindivisions,
    select: `id,f_user,n_gos_subdivision,${getSelectByColumns(pd_userindivisions)}`,
    globalFilters: [
      {
        property: "f_division",
        value: getDivisionByLogin(login),
      },
    ],
    handleSave: (record) => {
      const {
        id,
        f_user,
        f_user___b_disabled: b_disabled,
        f_user___c_description: c_description,
        f_user___c_email: c_email,
        f_user___c_first_name: c_first_name,
        f_user___c_login: c_login,
        f_user___c_phone: c_phone,
        n_gos_subdivision,
      } = record;
      runRpc({
        action: "pd_users",
        method: "Update",
        data: [
          {
            id: f_user,
            b_disabled,
            c_description,
            c_email,
            c_first_name,
            c_login,
            c_phone,
          },
        ],
        type: "rpc",
      }).then((response) => {
        runRpc({
          action: "pd_userindivisions",
          method: "Update",
          data: [
            {
              id,
              n_gos_subdivision
            },
          ],
          type: "rpc",
        }).then((response) => {
          tableComponent.setSelectedRow(null);
          tableComponent.loadData();
        });
      });
    },
    action: "pd_userindivisions",
    editable: true,
  });

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      {tableComponent.table}
    </div>
  );
};
