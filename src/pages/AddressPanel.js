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

export const AddressPanel = () => {
  const classes = useStyles();

  const cs_street = React.useMemo(
    () => [
      {
        title: "Тип",
        accessor: "c_short_type",
        Filter: StringFilter,
        Cell: StringCell,
        Editor: StringEditor,
      },
      {
        title: "Наименование",
        accessor: "c_name",
        Filter: StringFilter,
        Cell: StringCell,
        Editor: StringEditor,
      },
      {
        title: "Дата",
        accessor: "dx_date",
        Filter: DateFilter,
        Cell: DateCell,
      },
      {
        title: "Удалена",
        accessor: "b_disabled",
        Filter: BoolFilter,
        Cell: BoolCell,
      },
      // {
      //   title: "f_division",
      //   accessor: "f_division",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
      // {
      //   title: "f_user",
      //   accessor: "f_user",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
    ],
    []
  );

  const cs_house = React.useMemo(
    () => [
      {
        title: "Улица",
        accessor: "f_street",
        mapAccessor: "f_street___c_name",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "cs_street",
        },
        Filter: SelectFilter,
        Editor: SelectEditor,
        Cell: SelectCell,
      },
      {
        title: "Дом",
        accessor: "c_house_num",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Корпус",
        accessor: "c_build_num",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Дата создания",
        accessor: "dx_date",
        Filter: DateFilter,
        Cell: DateCell,
        Editor: DateEditor,
      },
      // {
      //   title: "b_disabled",
      //   accessor: "b_disabled",
      //   Filter: BoolFilter,
      //   Cell: BoolCell,
      // },
      // {
      //   title: "n_uik",
      //   accessor: "n_uik",
      //   Filter: NumberFilter,
      //   Cell: NumberCell,
      // },
      // {
      //   title: "c_floor",
      //   accessor: "c_floor",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      // },
      // {
      //   title: "c_porch",
      //   accessor: "c_porch",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      // },
      // {
      //   title: "f_subdivision",
      //   accessor: "f_subdivision",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
      // {
      //   title: "f_user",
      //   accessor: "f_user",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
      // {
      //   title: "f_candidate_users",
      //   accessor: "f_candidate_users",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
      {
        title: "УИК",
        accessor: "n_uik_correct",
        Filter: NumberFilter,
        Cell: NumberCell,
      },
      {
        title: "Корректный УИК",
        accessor: "b_correct_uik",
        Filter: BoolFilter,
        Cell: BoolCell,
        Editor: BoolEditor
      },
    ],
    []
  );

  const cs_appartament = React.useMemo(
    () => [
      // {
      //   title: "f_house",
      //   accessor: "f_house",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
      {
        title: "Номер квартиры",
        accessor: "c_number",
        Filter: StringFilter,
        Cell: StringCell,
      },
      // {
      //   title: "n_number",
      //   accessor: "n_number",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      // },
      {
        title: "Дата создания",
        accessor: "dx_date",
        Filter: DateFilter,
        Cell: DateCell,
      },
      {
        title: "Создана в 2018",
        accessor: "n_signature_2018",
        Filter: NumberFilter,
        Cell: NumberCell,
      },
      {
        title: "Удалена",
        accessor: "b_disabled",
        Filter: BoolFilter,
        Cell: BoolCell,
      },
      // {
      //   title: "f_user",
      //   accessor: "f_user",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
      
      // {
      //   title: "f_main_user",
      //   accessor: "f_main_user",
      //   Filter: (props) => <SelectFilter {...props} table="" />,
      //   Cell: StringCell,
      // },
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        <Table title={'Улицы'} columns={cs_street} select={`${getSelectByColumns(cs_street)},id`} action="cs_street" />
      </div>
      <div className={classes.table}>
        <Table title={'Дома'}  columns={cs_house} select={`${getSelectByColumns(cs_house)},id`} action="cs_house" />
      </div>
      <div className={classes.table}>
        <Table title={'Квартиры'} columns={cs_appartament} action="cs_appartament" />
      </div>
    </div>
  );
};
