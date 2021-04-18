import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  BoolFilter,
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
          title: "n_number",
          accessor: "n_number",
          operator: Operators.number,
          Filter: NumberFilter,
          Cell: NumberCell,
          style: { width: '80px', textAlign: 'center' }
        },
        {
          title: "c_fio",
          accessor: "c_fio",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "d_birthday",
          accessor: "d_birthday",
          operator: Operators.date,
          Filter: () => null,
          Cell: DateCell,
        },
        {
          title: "n_year",
          accessor: "n_year",
          operator: Operators.number,
          Filter: StringFilter,
          Cell: StringCell,
          style: { width: '80px', textAlign: 'center' }
        },
        {
          title: "c_document",
          accessor: "c_document",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "c_address",
          accessor: "c_address",
          operator: Operators.string,
          Filter: StringFilter,
          Cell: StringCell,
        },
        {
          title: "d_date",
          accessor: "d_date",
          operator: Operators.date,
          Filter: () => null,
          Cell: DateCell,
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
