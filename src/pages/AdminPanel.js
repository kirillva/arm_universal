import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BoolFilter, Operators, StringFilter } from "components/table/Filters";
import { BoolCell, StringCell } from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { useTableComponent } from "components/table/useTableComponent";
import { getSelectByColumns } from "utils/helpers";
import { getClaims, getItem, getUserId } from "utils/user";
import { runRpc } from "utils/rpc";
import { Button } from "@material-ui/core";
import { getUsers } from "utils/getUsers";
import { SelectUik } from "components/SelectUik";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    overflow: "auto",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  table: {
    flex: 1,
  },
}));

export const AdminPanel = () => {
  const classes = useStyles();

  const [users, setUsers] = useState(null);
  const [uik, setUik] = useState(null);
  const claims = getClaims();

  const pd_userindivisions = React.useMemo(
    () => [
      {
        title: "Логин",
        accessor: "f_user___c_login",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Пароль",
        accessor: "f_user___c_password",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "ФИО",
        accessor: "f_user___c_first_name",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Описание",
        accessor: "f_user___c_description",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Удален",
        accessor: "f_user___b_disabled",
        operator: Operators.bool,
        Filter: BoolFilter,
        Cell: BoolCell,
        Editor: BoolEditor,
      },
      {
        title: "Телефон",
        accessor: "f_user___c_phone",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "e-mail",
        accessor: "f_user___c_email",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Округ Госсовета",
        accessor: "n_gos_subdivision",
        operator: Operators.number,
        Filter: StringFilter,
        Cell: StringCell,
      },
      claims.indexOf(".monkey.") >= 0
        ? {
            title: "УИК",
            accessor: "f_uik",
            operator: Operators.number,
            Filter: StringFilter,
            Cell: StringCell,
            Editor: (props) => (
              <SelectUik
                value={props.value || uik}
                division={usersLoaded ? users[0].division.f_division : null}
                handleChange={(e) => {
                  props.setFieldValue("f_uik", e.target.value);
                }}
              />
            ),
          }
        : null,
    ].filter(item=>item),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uik]
  );

  useEffect(() => {
    getUsers(getUserId()).then((_users) => setUsers(_users));
  }, []);

  const login = getItem("login");

  const usersLoaded = users && users.length;
  const globalFilters = useMemo(
    () =>
      [
        login === "nov"
          ? {
              property: "f_user___c_login",
              value: "kalinin",
              operator: "<>",
            }
          : {
              property: "f_user___c_login",
              value: "nov",
              operator: "<>",
            },
        usersLoaded
          ? claims.indexOf(".monkey.") >= 0
            ? uik
              ? {
                  property: "f_uik",
                  value: uik,
                }
              : null
            : {
                property: "f_division",
                value: users[0].division.f_division,
              }
          : null,
      ].filter((item) => item),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, usersLoaded, uik]
  );

  const uikComponent = useMemo(() => {
    const options = {
      margin: "dense",
      size: "small",
      name: "n_uik",
      value: uik,
      handleChange: (e) => setUik(e.target.value),
    };
    if (usersLoaded) {
      options.division = users[0].division.f_division;
    } else {
      options.division = null;
    }

    if (claims.indexOf(".monkey.") >= 0) {
      return <SelectUik {...options} />;
    } else {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, usersLoaded, uik]);

  const tableComponent = useTableComponent({
    className: classes.table,
    title: "Список пользователей",
    columns: pd_userindivisions,
    select: `id,f_user,n_gos_subdivision,f_uik,${getSelectByColumns(
      pd_userindivisions
    )}`,
    globalFilters,
    allowLoad:
      usersLoaded &&
      (claims.indexOf(".monkey.") >= 0 ? uik : users[0].division.f_division),
    handleAdd: (record) => {
      runRpc({
        action: "pd_users",
        method: "Add",
        data: [
          {
            b_disabled: record.f_user___b_disabled,
            c_description: record.f_user___c_description,
            c_email: record.f_user___c_email,
            c_first_name: record.f_user___c_first_name,
            c_login: record.f_user___c_login,
            c_phone: record.f_user___c_phone,
            c_password: record.f_user___c_password,
          },
        ],
        type: "rpc",
      }).then((response) => {
        if (response.meta.success) {
          if (users && users.length && users[0]) {
            runRpc({
              action: "pd_userindivisions",
              method: "Add",
              data: [
                {
                  f_user: response.sql.rows[0].id,
                  f_division: users[0].division.f_division,
                  n_gos_subdivision: record.n_gos_subdivision,
                  f_uik: record.f_uik || uik
                },
              ],
              type: "rpc",
            }).then(() => {
              runRpc({
                action: "pd_userinroles",
                method: "Add",
                data: [
                  {
                    f_user: response.sql.rows[0].id,
                    f_role: claims.indexOf(".monkey.") >= 0 ? 5 : 6,
                  },
                ],
                type: "rpc",
              }).then(() => {
                runRpc({
                  action: "pd_userinroles",
                  method: "Add",
                  data: [
                    {
                      f_user: response.sql.rows[0].id,
                      f_role: 3,
                    },
                  ],
                  type: "rpc",
                }).then(() => {
                  tableComponent.setSelectedRow(null);
                  tableComponent.loadData();
                });
              });
            });
          } else {
            tableComponent.setSelectedRow(null);
            tableComponent.loadData();
          }
        }
      });
    },
    handleSave: async (record) => {
      const {
        id,
        f_user,
        f_user___b_disabled: b_disabled,
        f_user___c_description: c_description,
        f_user___c_email: c_email,
        f_user___c_first_name: c_first_name,
        f_user___c_login: c_login,
        f_user___c_phone: c_phone,
        n_gos_subdivision,
        f_user___c_password: c_password,
        f_uik,
      } = record;
      await runRpc({
        action: "pd_users",
        method: "Update",
        data: [
          {
            id: f_user,
            b_disabled,
            c_description,
            c_email,
            c_first_name,
            c_login,
            c_phone,
            c_password,
          },
        ],
        type: "rpc",
      });

      await runRpc({
        action: "pd_userindivisions",
        method: "Update",
        data: [
          {
            id,
            n_gos_subdivision,
            f_uik,
          },
        ],
        type: "rpc",
      });

      tableComponent.setSelectedRow(null);
      tableComponent.loadData();
    },
    action: "pd_userindivisions",
    editable: true,
  });

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      {uikComponent}
      <Button
        disabled={claims.indexOf(".monkey.") >= 0 ? !uik : false}
        variant="contained"
        color="primary"
        onClick={() => tableComponent.setSelectedRow({ original: {} })}
      >
        Добавить
      </Button>
      {tableComponent.table}
    </div>
  );
};
