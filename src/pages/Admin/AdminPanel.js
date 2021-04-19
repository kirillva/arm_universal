import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BoolFilter, Operators, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { useTableComponent } from "components/table/useTableComponent";
import { getSelectByColumns } from "utils/helpers";
import { getClaims, getItem, getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { Button, TextField } from "@material-ui/core";
import { useWindow } from "components/hooks/useWindow";
import { PlusOne } from "@material-ui/icons";
import { AdminDetail } from "./AdminDetail";

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

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(null);

  const pd_user = React.useMemo(
    () =>
      [
        {
          title: "Логин",
          accessor: "c_login",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Пароль",
          accessor: "c_password",
          operator: Operators.string,
          style: { display: 'none' },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "ФИО",
          accessor: "c_first_name",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Описание",
          accessor: "c_description",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Неактивен",
          accessor: "b_disabled",
          operator: Operators.bool,
          Filter: BoolFilter,
          Cell: BoolCell,
          Editor: BoolEditor,
        },
        {
          title: "Телефон",
          accessor: "c_email",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
      ].filter((item) => item),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableComponent = useTableComponent({
    className: classes.table,
    title: "Список пользователей",
    columns: pd_user,
    action: "pd_users",
    sortBy: [{ id: 'b_disabled', desc: false }, { id: 'c_login', desc: false }],
    globalFilters: React.useMemo(
      () => [
        {
          property: "c_login",
          value: ["anonymous", "admin"].map((key) => `'${key}'`),
          operator: "notin",
        },
      ],
      []
    ),
    select: `id,${getSelectByColumns(pd_user)}`,
    buttons: (
      <>
        <Button
          variant="contained"
          color="primary"
          endIcon={<PlusOne />}
          onClick={() => {
            setSelectedRow(null);
            setOpen(true);
          }}
        >
          Добавить
        </Button>
      </>
    ),
    handleClick: (record) => {
      setSelectedRow(record.row);
      setOpen(true);
    },
  });

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <AdminDetail
        onSubmit={() => {
          tableComponent.loadData();
          setOpen(false);
        }}
        record={selectedRow ? selectedRow.original : null}
        open={open}
        setOpen={setOpen}
      />

      {tableComponent.table}
    </div>
  );
};
