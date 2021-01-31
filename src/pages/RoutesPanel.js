import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import {
  BoolFilter,
  DateFilter,
  NumberFilter,
  StringFilter,
} from "components/table/Filters";
import {
  BoolCell,
  DateCell,
  NumberCell,
  SelectCell,
  StringCell,
} from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { BoolEditor, SelectEditor, StringEditor, DateEditor } from "components/table/Editors";
import { getSelectByColumns } from "utils/helpers";

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

export const RoutesPanel = () => {
  const classes = useStyles();

  const cs_street = React.useMemo(
    () => [
      {
        title: "Тип",
        mapAccessor: "f_type___c_name",
        accessor: 'f_type',
        fieldProps: {
            idProperty: "id",
            nameProperty: "c_name",
            table: "cs_route_types",
        },
        Filter: SelectFilter,
        Cell: SelectCell,
        Editor: SelectEditor,
      },
      {
        title: "Номер",
        accessor: "c_number",
        Filter: StringFilter,
        Cell: StringCell,
        Editor: StringEditor,
      },
      {
        title: "Дата",
        accessor: "d_date",
        Filter: DateFilter,
        Cell: DateCell,
        Editor: DateEditor
      }
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        <Table title={'Список маршрутов'} idProperty='id' columns={cs_street} select={`${getSelectByColumns(cs_street)},id`} action="cd_routes" />
      </div>
    </div>
  );
};
