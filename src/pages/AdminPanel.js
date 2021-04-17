import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BoolFilter, Operators, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { useTableComponent } from "components/table/useTableComponent";
import { getSelectByColumns } from "utils/helpers";
import { getClaims, getItem, getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { Button } from "@material-ui/core";
import { useWindow } from "components/hooks/useWindow";

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
  const { Window, setWindowOpen } = useWindow();

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
          title: "Удален",
          accessor: "c_phone",
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

  useEffect(() => {
    console.log();
  }, [selectedRow]);

  // console.log(selectedRow);
  // console.log(open);

  const tableComponent = useTableComponent({
    className: classes.table,
    title: "Список пользователей",
    columns: pd_user,
    action: "pd_users",
    globalFilters: React.useMemo(() => [], []),
    select: `id,${getSelectByColumns(pd_user)}`,
    buttons: (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedRow(null);
            setWindowOpen(true);
          }}
        >
          Добавить
        </Button>
      </>
    ),
    handleClick: (record) => {
      setSelectedRow(record.row);
      setWindowOpen(true);
      // setOpen(true);
    },
  });

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Window
        title={"Пользователь"}
        buttons={
          <>
            <Button variant="contained" color="primary">
              Сохранение
            </Button>
            <Button
              variant="contained"
              onClick={() => setWindowOpen(false)}
              color="primary"
            >
              Отмена
            </Button>
          </>
        }
      >
        {JSON.stringify(selectedRow && selectedRow.original)}
      </Window>

      {tableComponent.table}
    </div>
  );
};
