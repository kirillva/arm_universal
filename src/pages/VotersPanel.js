import React, { useEffect, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { getSelectByColumns } from "utils/helpers";
import { StringFilter } from "components/table/Filters";
import { SelectCell, StringCell } from "components/table/Cell";
import { SelectEditor, StringEditor } from "components/table/Editors";
import { SelectFilter } from "components/table/SelectFilter";
import { Button, Drawer } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { parse } from "query-string";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: 300,
  },
}));

const EditForm = ({ className, selectedRow }) => {
  return (
    <div className={className}>
      {JSON.stringify(selectedRow && selectedRow.original, null, 4)}
    </div>
  );
};

export const VotersPanel = () => {
  const classes = useStyles();
  const location = useLocation();
  
  const { id } = parse(location.search);

  const [selectedRow, setSelectedRow] = useState(id);

  const cs_appartament = React.useMemo(
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
        title: "Номер дома",
        accessor: "c_full_number",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Номер квартиры",
        accessor: "c_number",
        Filter: StringFilter,
        Cell: StringCell,
      },
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Table
        title={"Избиратели"}
        method="Select"
        columns={cs_appartament}
        handleClick={(cell, row) => setSelectedRow(row.id)}
        params={[180101, null, null]}
        action="cf_bss_cs_appartament"
      />
      <Drawer
        anchor={"right"}
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
      >
        <EditForm className={classes.drawer} selectedRow={selectedRow} />
      </Drawer>
    </div>
  );
};
