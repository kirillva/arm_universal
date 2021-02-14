import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, StringFilter } from "components/table/Filters";
import { BoolCell, SelectCell, StringCell } from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { SelectEditor } from "components/table/Editors";
import { getUserId } from "utils/user";
import { HouseDetail } from "./HouseDetail";
import { parse } from "query-string";

import { useLocation } from "react-router-dom";

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

export const StreetDetailTable = () => {
  const classes = useStyles();
  const location = useLocation();

  const { id } = parse(location.search);

  const [selectedHouse, setSelectedHouse] = useState(null);

  const cs_house = React.useMemo(
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
        title: "Причина",
        Filter: StringFilter,
        Cell: StringCell,
        accessor: "c_disabled",
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
      },
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        <Table
          title={"Дома"}
          method="Select"
          columns={cs_house}
          handleClick={(cell, row) => setSelectedHouse(row)}
          params={[getUserId(), id]}
          action="cf_bss_cs_house"
        />
      </div>
      <HouseDetail
        street={id}
        selectedHouse={selectedHouse}
        setSelectedHouse={setSelectedHouse}
      />
    </div>
  );
};
