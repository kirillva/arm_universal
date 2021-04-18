import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  BoolFilter,
  DateSingleFilter,
  NumberFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import {
  BoolCell,
  DateCell,
  NumberCell,
  StringCell,
} from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { useTableComponent } from "components/table/useTableComponent";
import { getSelectByColumns } from "utils/helpers";
import { getClaims, getItem, getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { Button, TextField } from "@material-ui/core";
import { useWindow } from "components/hooks/useWindow";
import { PlusOne } from "@material-ui/icons";
import { DocumentsDetail } from "./DocumentsDetail";

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

export const DocumentsPanel = () => {
  const classes = useStyles();

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(null);

  const pd_user = React.useMemo(
    () =>
      [
        {
          title: "Номер",
          accessor: "n_number",
          operator: Operators.number,
          Filter: NumberFilter,
          Cell: NumberCell,
          style: { width: '100px', textAlign: 'center' }
        },
        {
          title: "ФИО заявителя",
          accessor: "c_fio",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Дата рождения",
          accessor: "d_birthday",
          operator: Operators.date,
          style: { width: '170px', textAlign: 'center' },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Возраст на момент постановки",
          accessor: "n_year",
          operator: Operators.number,
          Filter: StringFilter,
          Cell: StringCell,
          style: { width: '100px', textAlign: 'center' }
        },
        {
          title: "Реквизиты документа, удостоверяющего личность",
          accessor: "c_document",
          operator: Operators.string,
          style: { width: '150px', textAlign: 'center' },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Адрес, телефон",
          accessor: "c_address",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Дата подачи заявления",
          accessor: "d_date",
          operator: Operators.date,
          style: { width: '170px', textAlign: 'center' },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Время подачи заявления",
          accessor: "c_time",
          operator: Operators.string,
          style: { width: '100px', textAlign: 'center' },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Цель использования земельного участка",
          accessor: "c_intent",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Постановление о постановке на учет",
          accessor: "c_account",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Дата и номер принятия решения",
          accessor: "c_accept",
          operator: Operators.string,
          style: { width: '100px', textAlign: 'center' },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Кадастровый номер принятия решения",
          accessor: "c_earth",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Решение о снятии с учета",
          accessor: "d_take_off_solution",
          operator: Operators.date,
          style: { width: '170px', textAlign: 'center' },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Сообщение заявителю о снятии с учета",
          accessor: "d_take_off_message",
          operator: Operators.date,
          style: { width: '170px', textAlign: 'center' },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Примечание",
          accessor: "c_notice",
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
    title: "Документы",
    columns: pd_user,
    action: "dd_documents",
    sortBy: [{ id: 'n_number', desc: true }],
    globalFilters: React.useMemo(
      () => [
        // {
        //   property: "c_login",
        //   value: ["anonymous", "admin"].map((key) => `'${key}'`),
        //   operator: "notin",
        // },
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
      <DocumentsDetail
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
