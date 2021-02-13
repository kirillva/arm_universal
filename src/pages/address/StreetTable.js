import React from "react";
import { Table } from "components/table/Table";
import {
  BoolFilter,
  StringFilter,
} from "components/table/Filters";
import {
  BoolCell,
  SelectCell,
  StringCell,
} from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import {
  SelectEditor,
} from "components/table/Editors";
import { useHistory } from "react-router-dom";


export const StreetTable = ({ id }) => {
  const history = useHistory();
   
  const cs_street = React.useMemo(
    () => [
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
        accessor: "f_division",
        mapAccessor: "c_division",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "sd_divisions",
        },
        Filter: SelectFilter,
        Editor: SelectEditor,
        Cell: SelectCell,
      },
      {
        title: "Удалена",
        Filter: BoolFilter,
        Cell: BoolCell,
        accessor: "b_disabled",
      },
      {
        title: "Автор",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_first_name",
      },
    ],
    []
  );
  return (
    <Table
      title={"Улицы"}
      handleClick={(cell, row)=>history.push(`/streetDetail?id=${row.id}`)}
      method="Select"
      params={[id]}
      columns={cs_street}
      action="cf_bss_cs_street"
    />
  );
};
