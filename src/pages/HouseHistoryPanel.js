import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, StringFilter } from "components/table/Filters";
import {
  BoolCell,
  NumberCell,
  SelectCell,
  StringCell,
} from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { EditHouseHistory } from "./EditHouseHistory";
import { Box, Drawer } from "@material-ui/core";

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
    height: "100%",
    flex: 1,
  },
  selectColumn: {
    width: 250,
  },
}));

export const HouseHistoryPanel = () => {
  const classes = useStyles();
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [params, setParams] = useState([]);
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  console.log("selectedHouse", selectedHouse);

  const pd_users = React.useMemo(
    () => [
      {
        title: "#",
        accessor: "n_row",
        Filter: () => null,
        Cell: NumberCell,
      },
      {
        title: "Улица",
        Filter: SelectFilter,
        accessor: "f_street",
        mapAccessor: "c_name",
        fieldProps: {
          className: classes.selectColumn,
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
        title: "Изменил",
        accessor: "c_first_name",
        Filter: StringFilter,
        Cell: StringCell,
      },
      {
        title: "Квартир",
        accessor: "n_premise_count",
        Filter: () => null,
        Cell: StringCell,
      },
    ],
    []
  );

  const next = () => {
    if (selectedHouse) {
      var index = data.findIndex((item) => item.id === selectedHouse.id);
      if (index < data.length) {
        setSelectedHouse({ ...data[index + 1] });
      }
    }
  };

  const previous = () => {
    if (selectedHouse) {
      var index = data.findIndex((item) => item.id === selectedHouse.id);
      if (index < data.length) {
        setSelectedHouse({ ...data[index - 1] });
      }
    }
  };

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
              next={next}
              previous={previous}
              setSelectedHouse={setSelectedHouse}
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
      <Box height="100%">
        <Table
          handleClick={(cell, row) => setSelectedHouse(row.original)}
          title="Список домов"
          params={params}
          columns={pd_users}
          onLoadData={(_data, total) => {
            setData(_data);
            setTotalPages(total);
          }}
          pageIndex={pageIndex}
          // sortBy={[{id: "c_name", desc: false}]}
          action={"cf_tmp_cs_house_unknow"}
          method="Select"
        />
      </Box>
    </div>
  );
};
