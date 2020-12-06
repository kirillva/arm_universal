import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { runRpc } from "utils/rpc";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getConfig } from "utils/helpers";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export const ResultPanel = withRouter(() => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [attachments, setAttachments] = useState([]);

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

  const loadAttachments = async (_selectedResult) => {
    let _cd_attachments = await runRpc({
      action: "cd_attachments",
      method: "Query",
      data: [
        {
          select: ["fn_file", "d_date", "n_latitude", "n_longitude"].join(","),
          filter: [
            {
              property: "fn_result",
              value: _selectedResult.id,
              operator: "=",
            },
          ],
        },
      ],
      type: "rpc",
    });
    _cd_attachments = _cd_attachments ? _cd_attachments.result.records : [];
    setAttachments(_cd_attachments);
  };

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    if (selectedResult) {
      loadAttachments(selectedResult);
    }
  }, [selectedResult]);

  const images = attachments.map((item) => ({
    original: `${getConfig().BASE_URL}/file?id=${item.fn_file}`,
    thumbnail: `${getConfig().BASE_URL}/file?id=${item.fn_file}`,
  }));
  console.log(images);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Typography paragraph>Результаты</Typography>
      <ImageGallery items={images} />
    </div>
  );
});
