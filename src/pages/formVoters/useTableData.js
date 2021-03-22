import { useEffect, useState } from "react";
import { runRpc } from "utils/rpc";

export const useTableData = ({ action, filter = [], autoload = true }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState([]);

  const load = () => {
    setLoading(true);
    runRpc({
      action,
      method: "Query",
      data: [
        {
          limit: 1000,
          sort: [{ property: "id", direction: "asc" }],
          filter
        },
      ],
      type: "rpc",
    })
      .then((responce) => {
        setLoading(false);
        setRecords(responce.result.records);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  useEffect(() => {
    autoload && load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    records,
    loading,
    load,
  };
};
