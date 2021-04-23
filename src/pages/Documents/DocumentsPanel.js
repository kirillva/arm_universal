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
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { useWindow } from "components/hooks/useWindow";
import { PlusOne } from "@material-ui/icons";
import { DocumentsDetail } from "./DocumentsDetail";
import { DocumentsList } from "./DocumentsList";
import SearchIcon from "@material-ui/icons/Search";

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
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
    marginBottom: '15px'
    // minHeight: '64px'
  },

  title: {
    flex: 1,
    margin: "0 0 0 15px",
  },
}));

export const DocumentsPanel = () => {
  const classes = useStyles();

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isReadOnly = getClaims().indexOf(".readonly.") >= 0;
  const isFullAccess = getClaims().indexOf(".full.") >= 0;
  const isOnlyChange = getClaims().indexOf(".change.") >= 0;

  const pd_user = React.useMemo(
    () =>
      [
        {
          title: "№ п/п",
          accessor: "n_number",
          operator: Operators.number,
          Filter: NumberFilter,
          Cell: NumberCell,
          width: "80px",
          style: { textAlign: "center" },
        },
        {
          title: "Фамилия, имя, отчество заявителя",
          accessor: "c_fio",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
          width: "400px",
          style: { textAlign: "center" },
        },
        {
          title: "Дата рождения",
          accessor: "d_birthday",
          operator: Operators.date,
          width: "150px",
          style: { textAlign: "center" },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Возраст на момент постановки",
          accessor: "n_year",
          operator: Operators.number,
          Filter: StringFilter,
          Cell: StringCell,
          width: "80px",
          style: { textAlign: "center" },
        },
        {
          title: "Реквизиты документа, удостоверяющего личность",
          accessor: "c_document",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
          width: "400px",
          style: { textAlign: "center" },
        },
        {
          title: "Адрес, телефон",
          accessor: "c_address",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
          width: "400px",
          style: { textAlign: "center" },
        },
        {
          title: "Дата подачи заявления",
          accessor: "d_date",
          operator: Operators.date,
          width: "150px",
          style: { textAlign: "center" },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Время подачи заявления",
          accessor: "c_time",
          operator: Operators.string,
          width: "100px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Цель использования земельного участка",
          accessor: "c_intent",
          operator: Operators.string,
          width: "150px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Постановление о постановке на учет (дата и номер)",
          accessor: "c_account",
          operator: Operators.string,
          width: "100px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Дата и номер принятия решения о предоставлении земельного участка",
          accessor: "c_accept",
          operator: Operators.string,
          width: "100px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Кадастровый номер земельного участка, предоставленного многодетной семье",
          accessor: "c_earth",
          operator: Operators.string,
          width: "100px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "Решение о снятии с учета (дата решения и номер) ",
          accessor: "d_take_off_solution",
          operator: Operators.date,
          width: "170px",
          style: { textAlign: "center" },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Сообщение заявителю о снятии с учета",
          accessor: "d_take_off_message",
          operator: Operators.date,
          width: "170px",
          style: { textAlign: "center" },
          Filter: DateSingleFilter,
          Cell: DateCell,
        },
        {
          title: "Примечание",
          accessor: "c_notice",
          width: "200px",
          style: { textAlign: "center" },
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
    hideTitle: true,
    columns: pd_user,
    action: "dd_documents",
    sortBy: [{ id: "n_number", desc: true }],
    globalFilters: React.useMemo(
      () => [
        {
          property: "sn_delete",
          value: false,
          operator: "=",
        },
      ],
      []
    ),
    select: `id,${getSelectByColumns(pd_user)}`,
    handleClick: (record) => {
      setSelectedRow(record.row.original.id);
      setOpen(true);
    },
  });

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.buttons}>
        <Typography className={classes.title} variant="h5">
          Заявления
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<SearchIcon />}
          onClick={() => setSearchOpen(true)}
        >
          Поиск
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<PlusOne />}
          disabled={!isFullAccess}
          onClick={() => {
            setSelectedRow(null);
            setOpen(true);
          }}
        >
          Добавить
        </Button>
        {tableComponent.exportButton}
      </div>
      {open && (
        <DocumentsDetail
          onSubmit={() => {
            tableComponent.loadData();
            setOpen(false);
          }}
          recordID={selectedRow ? selectedRow : -1}
          open={open}
          setOpen={setOpen}
        />
      )}
      {searchOpen && (
        <DocumentsList
          setOpen={setSearchOpen}
          open={searchOpen}
          onSelect={(id) => {
            setSelectedRow(id);
            setOpen(true);
            setSearchOpen(false);
          }}
          onClose={() => {
            setSearchOpen(false);
          }}
        />
      )}
      {tableComponent.table}
    </div>
  );
};
