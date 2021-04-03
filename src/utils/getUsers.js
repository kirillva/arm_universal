import { runRpc } from "utils/rpc";

export const getUsers = async (id) => {
  const pd_users_filter = [];
  if (id) {
    pd_users_filter.push({
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
        filter: pd_users_filter,
      },
    ],
    type: "rpc",
  });

  const pd_userindivisions_filter = []
  if (id) {
    pd_userindivisions_filter.push({
      property: "f_user",
      value: id,
      operator: "=",
    });
  }
  const pd_userindivisions = await runRpc({
    action: "pd_userindivisions",
    method: "Query",
    data: [
      {
        limit: 1000,
        filter: pd_userindivisions_filter,
      },
    ],
    type: "rpc",
  });
  
  if (pd_userindivisions) {
    debugger;
    return pd_users.result.records.map(usr => {
      const userindivision = pd_userindivisions.result.records.find(uid=>uid.f_user === usr.id)
      return {...usr, division: userindivision};
    });
    
  }

  return pd_users.result.records;
};
