import React, { useEffect, useState } from "react";
// import { Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
// import { runRpc } from "utils/rpc";
// import { getConfig } from "utils/helpers";
import { Table } from "components/table/Table";
import { getSelectByColumns } from "utils/helpers";
import { StringFilter } from "components/table/Filters";
import { SelectCell, StringCell } from "components/table/Cell";
import { SelectEditor, StringEditor } from "components/table/Editors";
import { SelectFilter } from "components/table/SelectFilter";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const EditForm = ({selectedRow}) => {
  return JSON.stringify(selectedRow && selectedRow.original);
}

export const VotersPanel = () => {
  const classes = useStyles();

  //   "id": "42c39523-9b86-d131-70ac-145d7cae90f7",
  //   "f_appartament": "38876ea0-be05-4091-988b-a9c14475c897",
  //   "c_first_name": "Аралбаева",
  //   "c_last_name": "Екатерина",
  //   "c_patronymic": "Валерьевна",
  //   "f_user": 1000043,
  //   "dx_created": "2020-10-29T09:38:30.402+0300",
  //   "n_birth_year": 1991,
  //   "c_org": null,
  //   "c_phone": null,
  //   "f_type": 12,
  //   "b_vote_2020

  const [selectedRow, setSelectedRow] = useState(null);

  const cd_people = React.useMemo(
    () => [
      {
        title: "Улица",
        mapAccessor: "f_appartament___f_house___f_street___c_name",
        accessor: "f_appartament___f_house___f_street",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "cs_street",
        },
        Filter: SelectFilter,
        Cell: SelectCell,
        Editor: SelectEditor,
      },
      {
        title: "Дом",
        mapAccessor: "f_appartament___f_house___c_full_number",
        accessor: "f_appartament___f_house",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_full_number",
          table: "cs_house",
        },
        Filter: SelectFilter,
        Cell: SelectCell,
        Editor: SelectEditor,
      },
      {
        title: "Квартира",
        mapAccessor: "f_appartament___c_number",
        accessor: "f_appartament",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_number",
          table: "cs_appartament",
        },
        Filter: SelectFilter,
        Cell: SelectCell,
        Editor: SelectEditor,
      },
      {
        title: "Фамилия",
        accessor: "c_first_name",
        Filter: StringFilter,
        Cell: StringCell,
        Editor: StringEditor,
      },
      {
        title: "Имя",
        accessor: "c_last_name",
        Filter: StringFilter,
        Cell: StringCell,
        Editor: StringEditor,
      },
      {
        title: "Отчество",
        accessor: "c_patronymic",
        Filter: StringFilter,
        Cell: StringCell,
        Editor: StringEditor,
      },
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Table
        title={"Избиратели"}
        idProperty="id"
        // editable
        handleClick={(cell, row)=>{
          // console.log(cell, row);
          setSelectedRow(row);
        }}
        columns={cd_people}
        select={`${getSelectByColumns(cd_people)},id`}
        action="cd_people"
      />
      <EditForm selectedRow={selectedRow} />
    </div>
  );
};
