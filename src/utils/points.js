import { runRpc } from "./rpc";
import moment from "moment";

export const getPoints = async (filter, users, sector) => {
  const body = {
    action: "cd_points",
    method: "Query",
    data: [
      {
        select: "",
        filter: [
          {
            property: "b_done",
            value: true,
            operator: "is"
          }
        ],
        limit: 5000
      }
    ],
    type: "rpc"
  };

  if (sector === "history") {
    body.data[0].filter.push({
      property: "d_done_date",
      value: filter.datePicker,
      operator: ">="
    });
    body.data[0].filter.push({
      property: "d_done_date",
      value: moment(filter.datePicker)
        .add(1, "days")
        .format("YYYY-MM-DD"),
      operator: "<"
    });
  }

  let filterInspectors = {};
  if (filter.inspectors)
    filterInspectors = {
      property: "fn_user",
      value: filter.inspectors,
      operator: "="
    };
  else if (users.length > 0)
    filterInspectors = {
      property: "fn_user",
      value: users.map(user => user.id),
      operator: "in"
    };

  if (filterInspectors.hasOwnProperty("property"))
    body.data[0].filter.push(filterInspectors);

  const data = runRpc(body).then(res => {
    return res.result.records;
  });
  return data;
};

export const isNeedPoints = filter => {
  if (
    filter.inspectors ||
    filter.managers ||
    filter.mainDivision ||
    filter.divisions.length ||
    filter.subDivision ||
    filter.datePicker !== moment().format("YYYY-MM-DD")
  )
    return true;
  return false;
};
