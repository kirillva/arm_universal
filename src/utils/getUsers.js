import { runRpc } from "utils/rpc";

export const getUsers = async (id) => {
  const filter = [];
  if (id) {
    filter.push({
      property: "id",
      value: id,
      operator: "=",
    });
  }
  const pd_users = await runRpc({
    action: "pd_users",
    method: "Query",
    data: [
      {
        limit: 1000,
        filter,
      },
    ],
    type: "rpc",
  });
  return pd_users.result.records;
};
