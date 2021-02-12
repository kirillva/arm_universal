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
import {
  BoolEditor,
  SelectEditor,
  DateEditor,
} from "components/table/Editors";
import { getSelectByColumns } from "utils/helpers";
import { getUserId } from "utils/user";
import { StreetTable } from "./StreetTable";

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
  const userId = 180101; //getUserId();
  

  const cs_house = React.useMemo(
    () => [
      // {
      //   title: "Улица",
      //   accessor: "f_street",
      //   mapAccessor: "f_street___c_name",
      //   fieldProps: {
      //     idProperty: "id",
      //     nameProperty: "c_name",
      //     table: "cs_street",
      //   },
      //   Filter: SelectFilter,
      //   Editor: SelectEditor,
      //   Cell: SelectCell,
      // },
      // {
      //   title: "Дом",
      //   accessor: "c_full_number",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      // },
      // {
      //   title: "Дата создания",
      //   accessor: "dx_date",
      //   Filter: DateFilter,
      //   Cell: DateCell,
      //   Editor: DateEditor,
      // }
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "c_name",
        Cell: ({ cell }) => {
          const { c_short_type, c_name } = cell.row.original;
          return `${c_short_type} ${c_name}`;
        },
      },
      {
        title: "Район",
        accessor: "f_subdivision",
        mapAccessor: "c_subdivision",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "sd_subdivisions",
        },
        Filter: SelectFilter,
        Editor: SelectEditor,
        Cell: SelectCell,
      },
      {
        title: "Номер дома",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_full_number",
      },
      {
        title: "Удалена",
        Filter: BoolFilter,
        Cell: BoolCell,
        accessor: "b_disabled",
      },
      {
        title: "УИК",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "n_uik",
      },
      {
        title: "Автор",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_first_name",
      }
    ],
    []
  );

  const cs_house_info = React.useMemo(
    () => [
      // {
      //   title: "Номер дома",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      //   accessor: "c_full_number",
      // },
      { 
        title: 'Тип избирателей',
        accessor: 'c_people_types' ,
        Filter: StringFilter,
        Cell: StringCell
      },
      { 
        title: 'Число квартир',
        accessor: 'n_appart_count',
        Filter: StringFilter,
        Cell: StringCell 
      },
      { 
        title: 'Число избирателей',
        accessor: 'n_count' ,
        Filter: StringFilter,
        Cell: StringCell
      },	
      { 
        title: 'Процент',
        accessor: 'n_percent' ,
        Filter: StringFilter,
        Cell: StringCell
      }
    ],
    []
  )
  

  const cs_house_loyalty = React.useMemo(
    () => [
      // { accessor: 'c_type' },
      // { accessor: 'c_name' },
      // {
      //   title: "Номер дома",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      //   accessor: "c_full_number",
      // },
      { 
        title: "Год",
        accessor: 'n_year',
        Filter: StringFilter,
        Cell: StringCell, 
      },
      { 
        title: "Рейтинг",
        accessor: 'n_rating',
        Filter: StringFilter,
        Cell: StringCell
      }
    ], 
    []
  );
  
  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        {/* <Table
          title={"Улицы"}
          selectable
          method="Select"
          params={[userId]}
          columns={cs_street}
          action="cf_bss_cs_street"
        /> */}
        <StreetTable id={180101} />
      </div>
      <div className={classes.table}>
        <Table
          title={"Дома"}
          selectable
          columns={cs_house}
          params={[180101, 'c0c21675-3691-4ecd-bb5f-727a9ffdc7d9']}
          action="cf_bss_cs_house"
        />
      </div>
      <div className={classes.table}>
        <Table
          title={"Избиратели в доме"}
          selectable
          idProperty={'c_people_types'}
          columns={cs_house_info}
          params={['c0c21675-3691-4ecd-bb5f-727a9ffdc7d9', '8c3c6638-5c0a-43f6-b236-c829431e8af2']}
          action="cf_bss_cs_house_info"
        />
      </div>
      <div className={classes.table}>
        <Table
          title={"Рейтинг"}
          selectable
          idProperty={'n_year'}
          columns={cs_house_loyalty}
          params={['c0c21675-3691-4ecd-bb5f-727a9ffdc7d9', '8c3c6638-5c0a-43f6-b236-c829431e8af2']}
          action="cf_bss_cs_house_loyalty"
        />
      </div>
    </div>
  );
};
