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
import { Button, Drawer } from "@material-ui/core";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    maxWidth: 700,
    minWidth: 500,
    overflowX: "hidden",
    width: "50%",
  },
  formWrapper: {
    flexDirection: "column",
    gap: theme.spacing(2),
    display: "flex",
  },
  innerContent: {
    flexDirection: "row",
    gap: theme.spacing(3),
    display: "flex",
  },
  selectedRow: {
    backgroundColor: "#0096005c",
  },
}));

export const AddressPanel = () => {
  const [params, setParams] = useState([getUserId()]);
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const cs_street = React.useMemo(
    () => [
      {
        title: "Тип",
        accessor: "c_short_type",
        style: {
          width: "80px",
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
      {
        title: "Завершен",
        Filter: BoolFilter,
        Cell: BoolCell,
        style: {
          width: "80px",
        },
        accessor: "b_finish",
      },
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
          <Drawer
            PaperProps={{
              className: classes.drawer,
            }}
            anchor="right"
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <AddStreet refreshPage={() => {
              setParams([getUserId()])
              setOpen(false);
            }} />
          </Drawer>
          <Table
            buttons={
              <>
                <Button
                  title={"Фильтры"}
                  className={classes.iconButton}
                  color={"black"}
                  onClick={() => setOpen(true)}
                >
                  <Add />
                </Button>
              </>
            }
            sortBy={[
              {
                id: "c_name",
                desc: false,
              },
            ]}
            title={"Улицы"}
            handleClick={(cell, row) =>
              history.push(`/street/detail?id=${row.id}`)
            }
            method="Select"
            params={params}
            columns={cs_street}
            getRowClassName={(row) =>
              row.original.b_finish ? classes.selectedRow : ""
            }
            action="cf_bss_cs_street"
          />
        </div>
      </div>
    </div>
  );
};
