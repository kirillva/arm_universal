import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import {
  BoolFilter,
  DateFilter,
  NumberFilter,
  StringFilter,
} from "components/table/Filters";
import {
  BoolCell,
  DateCell,
  NumberCell,
  SelectCell,
  StringCell,
} from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { BoolEditor, SelectEditor, DateEditor } from "components/table/Editors";
import { getSelectByColumns } from "utils/helpers";
import { getUserId } from "utils/user";
import { StreetDetailTable } from "./StreetDetailTable";
import { AddStreet } from "./AddStreet";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: 500,
  },
  formWrapper: {
    flexDirection: "column",
    gap: theme.spacing(3),
    display: "flex",
  },
  innerContent: {
    flexDirection: "row",
    gap: theme.spacing(3),
    display: "flex",
  },
}));

export const AddressPanel = () => {
  const [params, setParams] = useState([getUserId()]);
  const history = useHistory();

  const cs_street = React.useMemo(
    () => [
      {
        title: "Тип",
        accessor: "c_short_type",
        style: {
          width: '80px'
        },
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Улица",
        Filter: StringFilter,
        accessor: "c_name",
        Cell: StringCell,
      },
      // {
      //   title: "Район",
      //   accessor: "c_division",
      //   // mapAccessor: "c_division",
      //   // fieldProps: {
      //   //   idProperty: "id",
      //   //   nameProperty: "c_name",
      //   //   table: "sd_divisions",
      //   // },
      //   style: {
      //     width: '250px'
      //   },
      //   // Filter: SelectFilter,
      //   Filter: StringFilter,
      //   // Editor: SelectEditor,
      //   Cell: StringCell,
      // },
      // {
      //   title: "Удалена",
      //   Filter: BoolFilter,
      //   Cell: BoolCell,
      //   accessor: "b_disabled",
      // },
      // {
      //   title: "Причина",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      //   accessor: "c_disabled",
      // },
      // {
      //   title: "Автор",
      //   Filter: StringFilter,
      //   Cell: StringCell,
      //   accessor: "c_first_name",
      // },
    ],
    []
  );

  const classes = useStyles();

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        <div className={classes.innerContent}>
          {/* <div className={classes.formWrapper}>
            <AddStreet refreshPage={() => setParams([getUserId()])} />
          </div> */}
          <Table
            sortBy={[
              {
                id: "c_name",
                desc: false,
              },
            ]}
            title={"Улицы"}
            handleClick={(cell, row) =>
              history.push(`/streetDetail?id=${row.id}`)
            }
            method="Select"
            params={params}
            columns={cs_street}
            action="cf_bss_cs_street"
          />
        </div>
      </div>
    </div>
  );
};
