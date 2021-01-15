import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { runRpc } from "utils/rpc";
import { Table } from "components/Table";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const TablePanel = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  const loadResults = async () => {
    const id = "1165f88e-3a1d-434d-92d3-c06f72271ab8";

    let _cd_results = await runRpc({
      action: "cd_results",
      method: "Query",
      data: [
        {
          select: [
            "id",
            "fn_user_point",
            "fn_point",
            "fn_user_point___id___fn_registr_pts",
            "fn_type",
            "fn_user",
            "fn_route",
            "d_date",
            "c_notice",
            "b_warning",
            "jb_data",
            "dx_created",
          ].join(","),
          filter: [
            {
              property: "fn_user_point___id___fn_registr_pts",
              value: id,
              operator: "=",
            },
          ],
        },
      ],
      type: "rpc",
    });
    _cd_results = _cd_results ? _cd_results.result.records : [];
    setResults(_cd_results);
    if (_cd_results && _cd_results.length) {
      setSelectedResult(_cd_results[0]);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const columns = React.useMemo(
    () => [
      { title: "id", accessor: "id" },
      { title: "fn_user_point", accessor: "fn_user_point" },
      { title: "fn_point", accessor: "fn_point" },
      { title: "fn_type", accessor: "fn_type" },
      { title: "fn_user", accessor: "fn_user" },
      { title: "fn_route", accessor: "fn_route" },
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      {/* <Typography paragraph>Таблица</Typography>
      <pre>{JSON.stringify(results, null, 4)}</pre> */}
      <Table columns={columns} action="cd_results" />
    </div>
  );
};
