import React from "react";
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
import { StreetTable } from "./StreetTable";
import { StreetDetailTable } from "./StreetDetailTable";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    width: 500,
  },
}));

export const AddressPanel = () => {
  const userId = getUserId();

  const classes = useStyles();

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        {/* <Table
          title={"Улицы"}
          selectable
          method="Select"
          params={[userId]}
          columns={cs_street}
          action="cf_bss_cs_street"
        /> */}
        <StreetTable id={userId} />
      </div>
    </div>
  );
};
