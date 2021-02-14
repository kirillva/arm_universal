import React, { useMemo } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { StringFilter } from "components/table/Filters";
import { StringCell } from "components/table/Cell";
import { useHistory } from "react-router-dom";
import { getUserId } from "utils/user";

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

export const VotersList = () => {
  const classes = useStyles();
  const history = useHistory();

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
              const { f_house, f_street, id } = row.original;
              history.push({
                pathname: "/voters",
                search: `?f_house=${f_house}&f_street=${f_street}&f_appartment=${id}`,
              });
            }}
            params={[getUserId(), null, null]}
            action="cf_bss_cs_appartament"
          />
        );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])}

      {/* <Drawer
        anchor={"right"}
        open={Boolean(selectedRow)}
        onClose={() => {
          setSelectedRow(null);
          // history.push({
          //   pathname: "/voters",
          // });
        }}
      >
        <VoterSearchForm className={classes.drawer} selectedRow={selectedRow} />
      </Drawer> */}
    </div>
  );
};
