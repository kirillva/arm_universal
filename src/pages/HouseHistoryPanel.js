import React, { useCallback, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, StringFilter } from "components/table/Filters";
import { BoolCell, SelectCell, StringCell } from "components/table/Cell";
import { BoolEditor } from "components/table/Editors";
import { SelectFilter } from "components/table/SelectFilter";
import { EditHouseHistory } from "./EditHouseHistory";
import { Drawer } from "@material-ui/core";

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

export const HouseHistoryPanel = () => {
  const classes = useStyles();
  const [selectedHouse, setSelectedHouse] = useState(false);
  const [params, setParams] = useState([]);

  const pd_users = React.useMemo(
    () => [
      {
        title: "Улица",
        Filter: SelectFilter,
        accessor: "f_street",
        mapAccessor: "c_name",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "cs_street",
        },
        Cell: ({ cell }) => {
          const { c_short_type, c_name } = cell.row.original;
          return `${c_short_type} ${c_name}`;
        },
      },
      {
        title: "Округ ЧГСД",
        accessor: "f_subdivision",
        mapAccessor: "c_subdivision",
        fieldProps: {
          idProperty: "id",
          nameProperty: "c_name",
          table: "sd_subdivisions",
        },
        Filter: SelectFilter,
        Cell: SelectCell,
      },
      {
        title: "УИК",
        accessor: "n_uik",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Номер",
        accessor: "c_full_number",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Изменено",
        accessor: "c_first_name",
        Filter: StringFilter,
        Cell: StringCell,
      },
    ],
    []
  );

  return (
    <div className={classes.content}>
      {selectedHouse && (
        <div className={classes.text}>
          <Drawer
            anchor={"right"}
            open={Boolean(selectedHouse)}
            onClose={() => {
              setSelectedHouse(null);
            }}
          >
            <EditHouseHistory
              selectedHouse={selectedHouse}
              refreshPage={() => {
                setParams([]);
                setSelectedHouse(null);
              }}
            />
          </Drawer>
        </div>
      )}
      <div className={classes.toolbar} />
      <div className={classes.table}>
        <Table
          handleClick={(cell, row) => setSelectedHouse(row.original)}
          title="Список домов"
          params={params}
          columns={pd_users}
          action={"cf_tmp_cs_house_unknow"}
          method="Select"
        />
      </div>
    </div>
  );
};
