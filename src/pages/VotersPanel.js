import React, { useMemo, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { StringFilter } from "components/table/Filters";
import { StringCell } from "components/table/Cell";
import { Drawer } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { parse } from "query-string";
import { VoterEditForm } from "./VoterEditForm";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: 500,
  },
}));

export const VotersPanel = () => {
  const classes = useStyles();
  const location = useLocation();

  const { id } = parse(location.search);

  const [selectedRow, setSelectedRow] = useState(id);

  const cs_appartament = useMemo(
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
      {useMemo(() => {
        return (
          <Table
            title={"Избиратели"}
            method="Select"
            columns={cs_appartament}
            handleClick={(cell, row) => {
              setSelectedRow(row.id);
              // history.push({
              //   pathname: "/voters",
              //   search: `?id=${row.id}`,
              // });
            }}
            params={[180101, null, null]}
            action="cf_bss_cs_appartament"
          />
        );
      }, [])}

      <Drawer
        anchor={"right"}
        open={Boolean(selectedRow)}
        onClose={() => {
          setSelectedRow(null);
          // history.push({
          //   pathname: "/voters",
          // });
        }}
      >
        <VoterEditForm className={classes.drawer} selectedRow={selectedRow} />
      </Drawer>
    </div>
  );
};
