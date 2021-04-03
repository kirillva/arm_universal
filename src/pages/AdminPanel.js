import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BoolFilter, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { useTableComponent } from "components/table/useTableComponent";
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
  }
}));

export const AdminPanel = () => {
  const classes = useStyles();

  const pd_users = React.useMemo(
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
        accessor: "c_login",
        Filter: StringFilter,
        Cell: StringCell,
      },
      //   { accessor: "c_password", title: "c_password", Filter: StringFilter, Cell: StringCell },
      {
        title: "ФИО",
        accessor: "c_first_name",
        Filter: StringFilter,
        Cell: StringCell,
      },
      //   { accessor: "c_last_name", title: "c_last_name", Filter: StringFilter, Cell: StringCell },
      //   { accessor: "c_middle_name", title: "c_middle_name", Filter: StringFilter, Cell: StringCell },
      //   { accessor: "c_imei", title: "c_imei", Filter: StringFilter, Cell: StringCell },
      {
        title: "Описание",
        accessor: "c_description",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Удален",
        accessor: "b_disabled",
        Filter: BoolFilter,
        Cell: BoolCell,
        Editor: BoolEditor,
      },
      //   { title: "sn_delete", accessor: "sn_delete", Filter: BoolFilter, Cell: BoolCell },
      //   { title: "Версия", accessor: "c_version", Filter: StringFilter, Cell: StringCell },
      //   { title: "n_version", accessor: "n_version", Filter: StringFilter, Cell: StringCell },
      {
        title: "Телефон",
        accessor: "c_phone",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "e-mail",
        accessor: "c_email",
        Filter: StringFilter,
        Cell: StringCell,
      },
    ],
    []
  );

  const tableComponent = useTableComponent({
    className: classes.table,
    title: "Список пользователей",
    columns: pd_users,
    action: "pd_users",
    editable: true,
  });
  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      {tableComponent.table}
    </div>
  );
};
