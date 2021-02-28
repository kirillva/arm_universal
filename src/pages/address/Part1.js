import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, NumberFilter, StringFilter } from "components/table/Filters";
import {
  BoolCell,
  NumberCell,
  SelectCell,
  StringCell,
} from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { EditHouseHistory } from "../../components/EditHouseHistory";
import { Box, Button, Drawer } from "@material-ui/core";

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
    maxHeight: 440,
    flex: 1,
  },
  selectColumn: {
    width: 250,
  },
  drawer: {
    maxWidth: 700,
    overflowX: 'hidden',
    width: "50%",
  },
}));

export const Part1 = () => {
  const classes = useStyles();
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [params, setParams] = useState([]);
  // const [data, setData] = useState([]);
  // const [pageIndex, setPageIndex] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

  const pd_users = React.useMemo(
    () => [
      {
        title: "#",
        accessor: "n_row",
        Filter: () => null,
        Cell: NumberCell,
        style: {
          textAlign: 'center',
          width: '30px'
        }
      },
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
        style: {
          textAlign: 'center',
          width: '130px'
        }
      },
      {
        title: "УИК",
        accessor: "n_uik",
        Filter: NumberFilter,
        Cell: StringCell,
        style: {
          textAlign: 'center',
          width: '80px'
        }
      },
      {
        title: "Номер",
        accessor: "c_full_number",
        Filter: StringFilter,
        Cell: StringCell,
        style: {
          textAlign: 'center',
          width: '80px'
        }
      },
      {
        title: "Изменил",
        accessor: "c_first_name",
        Filter: StringFilter,
        Cell: StringCell,
        style: {
          textAlign: 'center',
          width: '80px'
        }
      },
      {
        title: "Квартир",
        accessor: "n_premise_count",
        Filter: () => null,
        Cell: StringCell,
        style: {
          textAlign: 'center',
          width: '80px'
        }
      },
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.text}>
        <Drawer
          PaperProps={{
            className: classes.drawer,
          }}
          anchor="right"
          open={Boolean(selectedHouse)}
          onClose={() => {
            setSelectedHouse(null);
          }}
        >
            {selectedHouse && (<EditHouseHistory
            setSelectedHouse={setSelectedHouse}
            selectedHouse={selectedHouse}
            refreshPage={() => {
              setParams([]);
              setSelectedHouse(null);
            }}
          />)}
        </Drawer>
      </div>
      <Box height="100%">
        <Table
          className={classes.table}
          handleClick={(cell, row) => setSelectedHouse(row.original)}
          title="Список домов"
          params={params}
          columns={pd_users}
          // onLoadData={(_data, total) => {
          //   setData(_data);
          //   setTotalPages(total);
          // }}
          // pageIndex={pageIndex}
          action={"cf_tmp_cs_house_unknow"}
          method="Select"
        />
      </Box>
    </div>
  );
};
