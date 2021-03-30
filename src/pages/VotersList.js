import React, { useEffect, useMemo, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { BoolFilter, Operators, StringFilter } from "components/table/Filters";
import { StringCell } from "components/table/Cell";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getItem, getUserId } from "utils/user";
import { getDivisionByLogin, getSelectByColumns } from "utils/helpers";
import CheckIcon from "@material-ui/icons/Check";
import { runRpc } from "utils/rpc";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  drawer: {
    minWidth: 300,
    maxWidth: 700,
    overflowX: "hidden",
    width: "50%",
  },
  table: {
    flex: 1,
  },
  selectedRow: {
    backgroundColor: '#e0e0e0'
  }
}));

export const VotersList = ({
  state,
  setState,
  uik,
  // setHouse,
  // setStreet,
  // setAppartament,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const login = getItem("login");

  const [filter, setFilter] = useState([
    login === "nov"
      ? {
          property: "f_house___f_street___f_main_division",
          value: getDivisionByLogin(login),
        }
      : {
          property: "sd_subdivisions.f_division",
          value: getDivisionByLogin(login),
        }
  ]);

  useEffect(() => {
    const newFilter = [
      login === "nov"
        ? {
            property: "f_house___f_street___f_main_division",
            value: getDivisionByLogin(login),
          }
        : {
            property: "sd_subdivisions.f_division",
            value: getDivisionByLogin(login),
          },
    ]
    if (uik) {
      newFilter.push({ property: "f_house___n_uik", value: `${uik}`, operator: '=' });
    }
    setFilter(newFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uik]);

  const filterProps = {
    BOOL_TRUE: "Нет",
    BOOL_FALSE: "Да",
  }
  const cs_appartament = useMemo(
    () => [
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "f_house___f_street___c_name",
        operator: Operators.string,
        Cell: ({ cell }) => {
          const {
            f_house___f_street___c_short_type,
            f_house___f_street___c_name,
          } = cell.row.original;
          return `${f_house___f_street___c_short_type} ${f_house___f_street___c_name}`;
        },
      },
      {
        title: "Активна",
        accessor: "f_house___f_street___b_disabled",
        operator: Operators.bool,
        Filter: ({...props}) => <BoolFilter {...props} props={filterProps} />,
        Cell: ({ cell }) => cell.value ? 'Нет' : 'Да',
      },
      {
        title: "Номер дома",
        accessor: "f_house___c_full_number",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Активен",
        accessor: "f_house___b_disabled",
        operator: Operators.bool,
        Filter: ({...props}) => <BoolFilter {...props} props={filterProps} />,
        Cell: ({ cell }) => cell.value ? 'Нет' : 'Да',
      },
      {
        title: "Номер квартиры",
        accessor: "c_number",
        operator: Operators.string,
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Активна",
        accessor: "b_disabled",
        operator: Operators.bool,
        Filter: ({...props}) => <BoolFilter {...props} props={filterProps} />,
        Cell: ({ cell }) => cell.value ? 'Нет' : 'Да',
      },
    ],
    []
  );

  return (
    <Table
      state={state}
      setState={setState}
      className={classes.table}
      title={"Избиратели"}
      method="Query"
      columns={cs_appartament}
      globalFilters={filter}
      getRowClassName={(row) => {
        const { f_house___f_street___b_disabled, f_house___b_disabled, b_disabled } =  row.original;
        return (f_house___f_street___b_disabled || f_house___b_disabled || b_disabled) ? classes.selectedRow : ""
      }}
      sortBy={[
        {
          id: "f_house___f_street___c_name",
          desc: false,
        },
        {
          id: "f_house___n_number",
          desc: false,
        },
        {
          id: "n_number",
          desc: false,
        },
      ]}
      select={`id,${getSelectByColumns(
        cs_appartament
      )},n_number,f_house___n_number,f_house___f_subdivision,f_house___f_street___f_main_division,f_house___f_subdivision___f_division,f_house___f_street,f_house,f_house___f_street___c_short_type,f_house___f_street___c_name,f_house___n_uik`}
      handleClick={(cell, row) => {
        const { f_house___f_street, f_house, id } = row.original;
        // setHouse(f_house);
        // setStreet(f_street);
        // setAppartament(id);
        history.push(
          `${match.path}/search?house=${f_house}&street=${f_house___f_street}&appartament=${id}`
        );
      }}
      actionButtons={[
        {
          icon: <CheckIcon />,
          title: "Назначить пользователя",
          handler: (ids) => {
            console.log(ids);

            runRpc({
              action: "cs_appartament",
              method: "Update",
              data: [
                Object.keys(ids)
                  .filter((key) => ids[key])
                  .map((item) => ({ id: item, f_user: getUserId() })),
              ],
              type: "rpc",
            });
          },
        },
      ]}
      // params={[getUserId(), null, null]}
      action="cs_appartament"
    />
  );
};
