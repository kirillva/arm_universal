import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  BoolFilter,
  ColorsFilter,
  DateFilter,
  DateSingleFilter,
  FromToFilter,
  NumberFilter,
  NumberFromToFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import {
  BoolCell,
  DateCell,
  dateRenderer,
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
import moment from "moment";

export const COLORS = {
  'красный': '#ee3f22',
  'оранжевый': '#f26f23',
  'желтый': '#fded20',
  'зеленый': '#02b049',
  'голубой': '#0095d7',
  'синий': '#1049a0',
  'фиолетовый': '#633391',
};

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
    marginBottom: "15px",
    // minHeight: '64px'
  },
  red: {
    backgroundColor: '#ee3f22'
  },
  orange: {
    backgroundColor: '#f26f23'
  },
  yellow: {
    backgroundColor: '#fded20'
  },
  green: {
    backgroundColor: '#02b049'
  },
  lightBlue: {
    backgroundColor: '#0095d7'
  },
  blue: {
    backgroundColor: '#1049a0'
  },
  violet: {
    backgroundColor: '#633391'
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
          operator: Operators.fromToNumber,
          Filter: NumberFromToFilter,
          Cell: NumberCell,
          width: "100px",
          style: { textAlign: "center" },
        },
        {
          title: "Фамилия, имя, отчество заявителя",
          accessor: "c_fio",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: ({ cell, ...props }) => {
            const value = cell.value;
            const {c_address, d_birthday} = props.row.original;
            const jb_child = props.row.original.jb_child || [];
            const title = `${value} ${c_address} ${moment(d_birthday).format('DD.MM.YYYY')};  ${jb_child.map((item) => {
              const { c_fio, c_address, d_birthday } = item;
              return `${c_fio} ${c_address} ${moment(d_birthday).format('DD.MM.YYYY')}; `;
            })}`;
            return <div title={title}>{value ? value : ""}</div>;
          },
          width: "400px",
          style: { textAlign: "center" },
        },
        {
          title: "Дата рождения",
          accessor: "d_birthday",
          operator: Operators.fromTo,
          width: "150px",
          style: { textAlign: "center" },
          exportRenderer: dateRenderer,
          Filter: DateFilter,
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
          width: "250px",
          style: { textAlign: "center" },
        },
        {
          title: "Адрес, телефон",
          accessor: "c_address",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
          width: "300px",
          style: { textAlign: "center" },
        },
        {
          title: "Дата подачи заявления",
          accessor: "d_date",
          operator: Operators.fromTo,
          width: "150px",
          style: { textAlign: "center" },
          exportRenderer: dateRenderer,
          Filter: DateFilter,
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
          width: "150px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title:
            "Дата и номер принятия решения о предоставлении земельного участка",
          accessor: "c_accept",
          operator: Operators.string,
          width: "200px",
          style: { textAlign: "center" },
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title:
            "Кадастровый номер земельного участка, предоставленного многодетной семье",
          accessor: "c_earth",
          operator: Operators.string,
          width: "200px",
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
          Filter: DateFilter,
          Cell: DateCell,
        },
        {
          title: "Сообщение заявителю о снятии с учета",
          accessor: "d_take_off_message",
          operator: Operators.date,
          width: "170px",
          style: { textAlign: "center" },
          Filter: DateFilter,
          Cell: DateCell,
        },
        {
          title: "Тег",
          accessor: "c_tag",
          operator: Operators.string,
          width: "150px",
          style: { textAlign: "center" },
          Filter: ColorsFilter,
          Cell: StringCell,
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
    getRowClassName: (row) => {
      switch (row.original.c_tag) {
        case 'красный':
          return classes.red;
        case 'оранжевый':
          return classes.orange;
        case 'желтый':
          return classes.yellow;
        case 'зеленый':
          return classes.green;
        case 'голубой':
          return classes.lightBlue;
        case 'синий':
          return classes.blue;
        case 'фиолетовый':
          return classes.violet;
        default:
          return ''
      }
    },
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
    select: `id,jb_child,${getSelectByColumns(pd_user)}`,
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
            setSelectedRow(-1);
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
