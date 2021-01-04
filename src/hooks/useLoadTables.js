import { useState } from "react";
import { runRpc } from "utils/rpc";
import _ from "lodash";

export const useLoadTables = () => {
  const [_action, _setAction] = useState(0);
  const [_pageIndex, _setPageIndex] = useState(0);
  const [_pageSize, _setPageSize] = useState(0);
  const [_filters, _setFilters] = useState([]);
  const [records, setRecords] = useState([]);

  return ({ action, pageIndex, pageSize, filters }) => {
    if (
      _action !== action ||
      _pageIndex !== pageIndex ||
      _pageSize !== pageSize ||
      !_.isEqual(_filters, filters)
    ) {
      debugger;
      _setAction(action);
      _setPageIndex(pageIndex);
      _setPageSize(pageSize);
      _setFilters(filters);

      return new Promise((resolve, reject) => {
        runRpc({
          action: action,
          method: "Query",
          data: [
            {
              page: pageIndex,
              start: pageIndex * pageSize,
              limit: pageSize,
              filter: filters.map((item) => ({
                property: item.id,
                value: item.value,
                operator: "like",
              })),
            },
          ],
          type: "rpc",
        }).then((responce) => {
          if (responce.meta && responce.meta.success) {
            const _records = responce.result.records;
            setRecords(_records);
            resolve(_records);
          } else {
            resolve([]);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(records);
      });
    }
  };
};
