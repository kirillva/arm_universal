import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BoolFilter, Operators, StringFilter } from "components/table/Filters";
import { BoolCell, DateCell, StringCell } from "components/table/Cell";
import { BoolEditor, DateEditor } from "components/table/Editors";
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
      { style: { display: 'none' }, title: "Домашний телефон", accessor: "f_user___c_phone_home", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Facebook", accessor: "f_user___c_facebook", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "VK", accessor: "f_user___c_vk", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "OK", accessor: "f_user___c_ok", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Twitter", accessor: "f_user___c_twitter", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Место работы", accessor: "f_user___c_work", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Должность", accessor: "f_user___c_job", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Секретарь ПО", accessor: "f_user___c_bit1", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Мун. деп.", accessor: "f_user___c_bit2", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Член МПС", accessor: "f_user___c_bit3", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Член РПС", accessor: "f_user___c_bit4", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Член ГС", accessor: "f_user___c_bit5", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Член ПРПС", accessor: "f_user___c_bit6", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Секретарь МО", accessor: "f_user___c_bit7", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Партийный статус", accessor: "f_user___c_bit8", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Примечание", accessor: "f_user___c_notice", operator: Operators.string, Filter: StringFilter, Cell: StringCell }, 
      { style: { display: 'none' }, title: "Телефон ответственного", accessor: "f_user___c_phone_main", operator: Operators.string, Filter: StringFilter, Cell: StringCell },
      
      { style: { display: 'none' }, title: "Дата рождения", accessor: "f_user___d_birthday", operator: Operators.string, Filter: ()=>null, Cell: DateCell, Editor: DateEditor }, 
      { style: { display: 'none' }, title: "Адрес", accessor: "f_user___c_address", operator: Operators.string, Filter: StringFilter, Cell: StringCell }
      
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
    select: `id,f_user,n_gos_subdivision,f_uik,f_user___c_phone_home,f_user___c_facebook,f_user___c_vk,f_user___c_ok,f_user___c_twitter,f_user___c_work,f_user___c_job,f_user___c_bit1,f_user___c_bit2,f_user___c_bit3,f_user___c_bit4,f_user___c_bit5,f_user___c_bit6,f_user___c_bit7,f_user___c_bit8,f_user___c_notice,f_user___c_phone_main,
    ${getSelectByColumns(
      pd_userindivisions
    )}`,
    globalFilters,
    allowLoad: usersLoaded &&
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
            c_phone_home: record.f_user___c_phone_home,	
            c_facebook: record.f_user___c_facebook,	
            c_vk: record.f_user___c_vk,	
            c_ok: record.f_user___c_ok,	
            c_twitter: record.f_user___c_twitter,	
            c_work: record.f_user___c_work,	
            c_job: record.f_user___c_job,	
            c_bit1: record.f_user___c_bit1,	
            c_bit2: record.f_user___c_bit2,	
            c_bit3: record.f_user___c_bit3,	
            c_bit4: record.f_user___c_bit4,	
            c_bit5: record.f_user___c_bit5,	
            c_bit6: record.f_user___c_bit6,	
            c_bit7: record.f_user___c_bit7,	
            c_bit8: record.f_user___c_bit8,	
            c_notice: record.f_user___c_notice,	
            c_phone_main: record.f_user___c_phone_main,  
            d_birthday: record.f_user___d_birthday,	
            c_address: record.f_user___c_address,	
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
            c_phone_home: record.f_user___c_phone_home,
            c_facebook: record.f_user___c_facebook,
            c_vk: record.f_user___c_vk,
            c_ok: record.f_user___c_ok,
            c_twitter: record.f_user___c_twitter,
            c_work: record.f_user___c_work,
            c_job: record.f_user___c_job,
            c_bit1: record.f_user___c_bit1,
            c_bit2: record.f_user___c_bit2,
            c_bit3: record.f_user___c_bit3,
            c_bit4: record.f_user___c_bit4,
            c_bit5: record.f_user___c_bit5,
            c_bit6: record.f_user___c_bit6,
            c_bit7: record.f_user___c_bit7,
            c_bit8: record.f_user___c_bit8,
            c_notice: record.f_user___c_notice,
            c_phone_main: record.f_user___c_phone_main,
            d_birthday: record.f_user___d_birthday,	
            c_address: record.f_user___c_address,	
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
